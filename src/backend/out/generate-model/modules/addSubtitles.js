import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import breakLine from '../lib/breakLine.js';
/**
 * ? __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
/**
 * ? Add Subtitles Function
 * * Adds Advanced SubStation Alpha format subtitles to the video
 * @param test
 * @param profile
 */
export default async function addSubtitles(test) {
    if ((test.enabled && test.unitToTest === 'addSubtitles') || !test.enabled) {
        const subtitlesFile = '../../../files/generate-model/permanent/subtitles.ass';
        const videoFile = path.join(__dirname, '../../../files/generate-model/temporary/concat/output.mp4').replace(/\\/g, '/');
        const outputFile = path.join(__dirname, '../../../files/generate-model/temporary/subtitled/output.mp4').replace(/\\/g, '/');
        /**
         * * Check if the subtitle file exists
         */
        if (!fs.existsSync(path.join(__dirname, subtitlesFile))) {
            breakLine();
            console.error(`Subtitle file does not exist: ${subtitlesFile}`);
            return;
        }
        /**
         * * Check if the video file exists
         */
        if (!fs.existsSync(videoFile)) {
            breakLine();
            console.error(`Video file does not exist: ${videoFile}`);
            return;
        }
        /**
         * * Check if the output directory exists and create it if not
         */
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        /**
         * * Empty the output directory
         */
        fs.emptyDirSync(outputDir);
        /**
         * * Add subtitles to the video
         */
        const ffmpeg = spawnSync('ffmpeg', ['-i', videoFile, '-vf', `ass=${subtitlesFile}`, outputFile], { cwd: __dirname });
        /**
         * * Check if the subtitles were added successfully
         */
        if (ffmpeg.stderr.toString()) {
            console.error(ffmpeg.stderr.toString());
            return;
        }
    }
}
