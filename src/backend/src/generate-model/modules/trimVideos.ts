import StefanAIVideoScript from '../@types/StefanAiVideoScript.js'
import { subCombination } from '../@types/Combination.js'
import TestInterface from '../@types/TestInterface.js'
import createTTS from '../lib/createTTS.js'
import { spawnSync } from 'child_process'
import Video from '../@types/Video.js'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import path from 'path'
import Profile from '../@types/Profile.js'

const currentModuleUrl = new URL(import.meta.url)
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

const BREAK_TIME_IF_EXTENDS = '<break time="0.17s"/>\n'
const BREAK_TIME_IF_NOT_EXTENDS = '<break time="0.5s"/>\n'

export default async function trimVideos(test: TestInterface, voice: string, currentCombination: subCombination, profile: Profile) {
    if ((test.enabled && test.unitToTest === 'trimVideos') || !test.enabled) {
        const durations: Array<number> = await parseSSMLSegments(voice)

        const trimDir = path.join(__dirname, '../../../files/generate-model/temporary/trim')
        fs.emptyDirSync(trimDir)

        for (let index = 0; index < durations.length; index++) {
            const currentClip = currentCombination[index] as string
            const videoPath = path.join(__dirname, '../../../videos', currentClip)

            const video = ffmpeg(videoPath)
            video.noAudio()

            if (index === 0 && profile.settings.easy.loop) {
                await createClip(video, durations[index], trimDir, index + 1)
                await createLoopClip(videoPath, trimDir)
            } else {
                await createClip(video, durations[index], trimDir, index + 1)
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createClip(video: any, duration: number, trimDir: string, index: number) {
    video.setStartTime(0)
    video.setDuration(duration)
    video.output(path.join(trimDir, `${index}.mp4`))

    await new Promise((resolve, reject) => {
        video.on('error', (error: string) => {
            console.error(error)
            reject(error)
        })

        video.on('end', () => {
            resolve(true)
        })

        video.run()
    })
}

async function createLoopClip(videoPath: string, trimDir: string) {
    const loopVideo = ffmpeg(videoPath)
    loopVideo.setStartTime(0)
    loopVideo.setDuration(1)
    loopVideo.output(path.join(trimDir, 'loop.mp4'))

    await new Promise((resolve, reject) => {
        loopVideo.on('error', (error) => {
            console.error(error)
            reject(error)
        })

        loopVideo.on('end', () => {
            resolve(true)
        })

        loopVideo.run()
    })
}

async function parseSSMLSegments(voice: string): Promise<Array<number>> {
    const durations = new Array<number>()

    const subtitlesJSON = path.join(__dirname, '../../../files/generate-model/permanent/prompt.json')
    let videoScriptJSON: StefanAIVideoScript
    try {
        videoScriptJSON = fs.readJsonSync(subtitlesJSON, { encoding: 'utf-8' })
    } catch (error) {
        console.error(`Failed to read JSON file: ${subtitlesJSON}`, error)
        throw error
    }

    const keys = Object.keys(videoScriptJSON)

    for (const key of keys) {
        const videoIndex = parseInt(key.replace('video', ''))
        durations.push(await retrieveTiming(videoIndex, voice, videoScriptJSON))
    }

    return durations
}

async function retrieveTiming(videoIndex: number, voice: string, videoScriptJSON: StefanAIVideoScript): Promise<number> {
    let SSML: string = '<speak>\n'

    try {
        let subtitle = ((videoScriptJSON[`video${videoIndex}`] as Video)?.message as string)?.replace(/,/g, ',<break time="0.4s"/>')
        subtitle = subtitle.replace(/\bif\b/gi, '<emphasis level="strong">if</emphasis>')

        SSML += `<p><s>${subtitle}</s></p>\n`

        if ((videoScriptJSON[`video${videoIndex}`] as Video)?.extends) {
            SSML += BREAK_TIME_IF_EXTENDS
        } else {
            SSML += BREAK_TIME_IF_NOT_EXTENDS
        }
    } finally {
        SSML += '</speak>'
    }

    await createTTS(SSML, 'lengthTest', voice)

    const lengthAudioFile = path.join(__dirname, '../../../files/generate-model/temporary/lengthTest.mp3')
    const ffprobe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', lengthAudioFile])
    try {
        fs.unlinkSync(lengthAudioFile)
    } catch (error) {
        console.error(`Failed to delete file: ${lengthAudioFile}`, error)
    }
    return parseFloat(Number(ffprobe.stdout.toString()).toFixed(3))
}