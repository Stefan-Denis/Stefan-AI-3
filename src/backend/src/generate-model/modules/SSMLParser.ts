import TestInterface from '../@types/TestInterface.js'
import StefanAIVideoScript from '../@types/StefanAiVideoScript.js'

import fs from 'fs-extra'
import path from 'path'

/**
 * ? __dirname Variable
 * * Used to get the current directory of the app
 */
const currentModuleUrl = new URL(import.meta.url)
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

export default async function SSMLParser(test: TestInterface) {
    if ((test.enabled && test.unitToTest === 'SSMLParser') || !test.enabled) {
        let matrix: Array<Array<string | boolean>> = []

        const ssmlFilePath = path.join(__dirname, '../', 'temporary', 'propietary', 'subtitles.ssml')
        const videoScriptJSON: StefanAIVideoScript = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'temporary', 'propietary', 'prompt.json'), 'utf-8'))


    }
}