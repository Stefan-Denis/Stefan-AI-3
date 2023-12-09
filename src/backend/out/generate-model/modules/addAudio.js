import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
/**
 * ? __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
export default async function addAudios(test) {
    if ((test.enabled && test.unitToTest === 'addAudios') || !test.enabled) {
        const ttsFile = path.join(__dirname, '../../../files/generate-model/temporary/subtitles.mp3');
        const videoFile = path.join(__dirname, '../../../files/generate-model/temporary/subtitled/output.mp4');
        const outputFileLocation = path.join(__dirname, '../../../files/generate-model/temporary/ttsAdded/output.mp4');
        /**
         * * Delete the output file if it exists
         */
        fs.emptyDirSync(path.join(__dirname, '../../../files/generate-model/temporary/ttsAdded/'));
        /**
         * * Add tts with ffmpeg on top of the audio
         */
        spawnSync('ffmpeg', ['-i', videoFile, '-i', ttsFile, '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', '-shortest', '-y', outputFileLocation]);
    }
}
