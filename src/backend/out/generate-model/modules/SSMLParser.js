import fs from 'fs-extra';
import path from 'path';
/**
 * ? __dirname Variable
 * * Used to get the current directory of the app
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
export default async function SSMLParser(test) {
    if ((test.enabled && test.unitToTest === 'SSMLParser') || !test.enabled) {
        const matrix = [];
        const videoScriptJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), 'utf-8'));
        for (const key in videoScriptJSON) {
            const video = videoScriptJSON[key];
            if (typeof video !== 'string' && video?.isUsed) {
                matrix.push([video.message]);
            }
            if (typeof video !== 'string' && video?.extends) {
                matrix[matrix.length - 1].push(true);
            }
        }
        let SSML = '<speak>\n';
        try {
            for (let x = 0; x < matrix.length; x++) {
                let subtitle = matrix[x][0].replace(/,/g, ',<break time="0.4s"/>');
                subtitle = subtitle.replace(/\bif\b/gi, '<emphasis level="strong">if</emphasis>');
                SSML += `<p><s>${subtitle}</s></p>\n`;
                if (matrix[x][1]) {
                    SSML += '<break time="0.17s"/>\n';
                }
                else if (x === matrix.length - 1) {
                    // Do nothing
                }
                else {
                    SSML += '<break time="0.5s"/>\n';
                }
            }
        }
        finally {
            SSML += '</speak>';
        }
        fs.writeFileSync(path.join(__dirname, '../../../files/generate-model/permanent/subtitles.ssml'), SSML);
    }
}
