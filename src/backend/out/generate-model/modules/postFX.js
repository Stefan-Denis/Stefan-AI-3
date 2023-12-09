import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
/**
 * ? __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
export default async function postFX(test, profile) {
    if ((test.enabled && test.unitToTest === 'postFX') || !test.enabled) {
        const videoFile = path.join(__dirname, '../../../files/generate-model/temporary/ttsAdded/output.mp4');
        const outputFileLocation = path.join(__dirname, '../../../files/generate-model/temporary/postFX/output.mp4');
        /**
         * * Delete the output file if it exists
         */
        fs.emptyDirSync(path.join(__dirname, '../../../files/generate-model/temporary/postFX'));
        /**
         * * Add postFX with ffmpeg
         */
        const filters = [];
        if (profile.settings.advanced.upscale) {
            filters.push('unsharp=5:5:1.0:5:5:0.0');
        }
        if (profile.settings.advanced.colorful && profile.settings.advanced.contrast) {
            const contrast = profile.settings.advanced.contrast ? profile.settings.advanced.contrast : 1.3;
            filters.push(`eq=brightness=0.06:contrast=${contrast}:saturation=2`);
        }
        else if (profile.settings.advanced.colorful && !profile.settings.advanced.contrast) {
            filters.push('eq=brightness=0.06:contrast=1.0:saturation=2');
        }
        else if (!profile.settings.advanced.colorful && profile.settings.advanced.contrast) {
            const contrast = profile.settings.advanced.contrast ? profile.settings.advanced.contrast : 1.3;
            filters.push(`eq=brightness=0.06:contrast=${contrast}:saturation=1.0`);
        }
        const args = ['-i', videoFile, '-vf', filters.join(','), '-r', '60', outputFileLocation];
        const result = spawnSync('ffmpeg', args);
        if (result.error) {
            console.log(result.error);
            await postFX(test, profile);
            return;
        }
        else {
            return true;
        }
    }
}
