import createTTS from '../lib/createTTS.js';
import { spawnSync } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
const BREAK_TIME_IF_EXTENDS = '<break time="0.17s"/>\n';
const BREAK_TIME_IF_NOT_EXTENDS = '<break time="0.5s"/>\n';
export default async function trimVideos(test, voice, currentCombination, profile) {
    if ((test.enabled && test.unitToTest === 'trimVideos') || !test.enabled) {
        const durations = await parseSSMLSegments(voice);
        const trimDir = path.join(__dirname, '../../../files/generate-model/temporary/trim');
        fs.emptyDirSync(trimDir);
        for (let index = 0; index < durations.length; index++) {
            const currentClip = currentCombination[index];
            const videoPath = path.join(__dirname, '../../../videos', currentClip);
            const video = ffmpeg(videoPath);
            video.noAudio();
            if (index === 0 && profile.settings.easy.loop) {
                await createClip(video, durations[index], trimDir, index + 1);
                await createLoopClip(videoPath, trimDir);
            }
            else {
                await createClip(video, durations[index], trimDir, index + 1);
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createClip(video, duration, trimDir, index) {
    video.setStartTime(0);
    video.setDuration(duration);
    video.output(path.join(trimDir, `${index}.mp4`));
    await new Promise((resolve, reject) => {
        video.on('error', (error) => {
            console.error(error);
            reject(error);
        });
        video.on('end', () => {
            resolve(true);
        });
        video.run();
    });
}
async function createLoopClip(videoPath, trimDir) {
    const loopVideo = ffmpeg(videoPath);
    loopVideo.setStartTime(0);
    loopVideo.setDuration(1);
    loopVideo.output(path.join(trimDir, 'loop.mp4'));
    await new Promise((resolve, reject) => {
        loopVideo.on('error', (error) => {
            console.error(error);
            reject(error);
        });
        loopVideo.on('end', () => {
            resolve(true);
        });
        loopVideo.run();
    });
}
async function parseSSMLSegments(voice) {
    const durations = new Array();
    const subtitlesJSON = path.join(__dirname, '../../../files/generate-model/permanent/prompt.json');
    let videoScriptJSON;
    try {
        videoScriptJSON = fs.readJsonSync(subtitlesJSON, { encoding: 'utf-8' });
    }
    catch (error) {
        console.error(`Failed to read JSON file: ${subtitlesJSON}`, error);
        throw error;
    }
    const keys = Object.keys(videoScriptJSON);
    for (const key of keys) {
        const videoIndex = parseInt(key.replace('video', ''));
        durations.push(await retrieveTiming(videoIndex, voice, videoScriptJSON));
    }
    return durations;
}
async function retrieveTiming(videoIndex, voice, videoScriptJSON) {
    let SSML = '<speak>\n';
    try {
        let subtitle = videoScriptJSON[`video${videoIndex}`]?.message?.replace(/,/g, ',<break time="0.4s"/>');
        subtitle = subtitle.replace(/\bif\b/gi, '<emphasis level="strong">if</emphasis>');
        SSML += `<p><s>${subtitle}</s></p>\n`;
        if (videoScriptJSON[`video${videoIndex}`]?.extends) {
            SSML += BREAK_TIME_IF_EXTENDS;
        }
        else {
            SSML += BREAK_TIME_IF_NOT_EXTENDS;
        }
    }
    finally {
        SSML += '</speak>';
    }
    await createTTS(SSML, 'lengthTest', voice);
    const lengthAudioFile = path.join(__dirname, '../../../files/generate-model/temporary/lengthTest.mp3');
    const ffprobe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', lengthAudioFile]);
    try {
        fs.unlinkSync(lengthAudioFile);
    }
    catch (error) {
        console.error(`Failed to delete file: ${lengthAudioFile}`, error);
    }
    return parseFloat(Number(ffprobe.stdout.toString()).toFixed(3));
}
