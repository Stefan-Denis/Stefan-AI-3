import fs from 'fs-extra'
import path from 'path'

import TestInterface from '../@types/TestInterface.js'
import Timing from '../@types/timing.js'
import breakLine from '../lib/breakLine.js'

/**
 * ? __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url)
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

/**
 * Parse the Timings into subtitles
 * @param test 
 * @param timings 
 */
export default async function parseSubtitles(test: TestInterface, timings: Array<Timing>) {
    if ((test.enabled && test.unitToTest === 'parseTimings') || !test.enabled) {

        // * Prepare subtitle file
        const defaultFile = path.join(__dirname, '../../../files/generate-model/permanent/default.ass')
        const subtitleFile = path.join(__dirname, '../../../files/generate-model/permanent/subtitles.ass')

        const defaultSubtitleData = fs.readFileSync(defaultFile, 'utf-8')
        fs.writeFileSync(subtitleFile, defaultSubtitleData)

        breakLine()
        console.log(timings)
        breakLine()

        timings.forEach((timing: Timing) => {
            const minTime = formatTime(timing.xmin)
            const maxTime = formatTime(timing.xmax)
            const text = timing.text

            const subtitle = createSubtitle(minTime, maxTime, text)

            fs.appendFileSync(subtitleFile, '\n' + subtitle)
        })
    }
}

/**
 * * Format seconds into .ass time
 * @param time
 */
function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(1, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`
}

/**
 * * Create Advanced SubStation Alpha format subtitles
 * * Includes a pop in animation
 * @param startTime
 * @param endTime
 * @param text
 */
function createSubtitle(startTime: string, endTime: string, text: string) {
    return `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,{\t(0,100,\fscx105\fscy105)\t(100,200,\fscx100\fscy100)}${text}`
}