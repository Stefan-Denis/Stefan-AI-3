import breakLine from '../lib/breakLine.js';
import concat from 'ffmpeg-concat';
import fs from 'fs-extra';
import path from 'path';
import { Wait } from '../lib/wait.js';
export default async function concatVideos(test, profile) {
    if ((test.enabled && test.unitToTest === 'concatVideos') || !test.enabled) {
        const currentModuleUrl = new URL(import.meta.url);
        const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
        const trimDir = path.join(__dirname, '../../../files/generate-model/temporary/trim');
        const concatDir = path.join(__dirname, '../../../files/generate-model/temporary/concat');
        const files = fs.readdirSync(trimDir).filter(file => path.extname(file) === '.mp4' && path.basename(file, '.mp4') !== 'loop');
        fs.emptyDirSync(concatDir);
        if (profile.settings.easy.loop) {
            files.push('loop.mp4');
        }
        const outputPath = path.join(concatDir, 'output.mp4');
        try {
            breakLine();
            await Wait.seconds(5);
            await concat({
                concurrency: profile.settings.advanced.cpuCores,
                output: outputPath,
                videos: files.map(file => path.join(trimDir, file)),
                transition: profile.settings.advanced.transitions.enabled ? {
                    name: 'crosszoom',
                    duration: 300
                } : undefined,
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}
