import TestInterface from '../@types/TestInterface.js'
import { spawnSync } from 'child_process'
import path from 'path'

import fs from 'fs-extra'
import createTTS from '../lib/createTTS.js'

export default async function testTTSLength(test: TestInterface, voice: string): Promise<number> {
    /**
     * ? __dirname Variable
     * * Used to get the current directory of the app
     */
    const currentModuleUrl = new URL(import.meta.url)
    const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

    let time = 0

    if ((test.enabled && test.unitToTest === 'testTTSLength') || !test.enabled) {
        const SSML = fs.readFileSync(path.join(__dirname, '../../../files/generate-model/permanent/subtitles.ssml'), 'utf-8')

        await createTTS(SSML, 'subtitles', voice)

        // Get the length of the audio file
        const tempAudioFilePath = path.join(__dirname, '../../../files/generate-model/temporary/subtitles.mp3')
        const ffprobe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', tempAudioFilePath])
        time = parseFloat(Number(ffprobe.stdout.toString()).toFixed(3))
    }

    return time
}