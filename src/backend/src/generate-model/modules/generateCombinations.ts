import fs from 'fs-extra'
import path from 'path'

import Profile from '../@types/Profile.d.js'
import { Combination } from '../@types/Combination.js'

/**
 * __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url)
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

/**
 * Advanced, Complex algorithm to generate all the possible combinations of the videos.
 * (Based off of the user settings)
 * @param combinationsFilePath Path to the combinations file
*/
export default async function generateCombinations(combinationsFilePath: string, appSettings: Profile) {
    // Clear the directory where the output videos are saved
    fs.emptyDirSync(path.join(__dirname, '../../../../../output/generated-videos'))

    // Grab all the videos
    const videoPath = path.join(__dirname, '../../../videos')
    const files: Array<string> = fs.readdirSync(videoPath).filter(file => path.extname(file) === '.mp4')

    const permutations: Combination = await generatePermutations(appSettings, files)

    try {
        fs.writeFileSync(combinationsFilePath, JSON.stringify(permutations, null, 4))
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

async function generatePermutations(app: Profile, files: Array<string>): Promise<Combination> {
    /**
     * Propietary type for the video data.
     * Stored in a matrix system
     */
    type videoDataMatrix = Array<Array<string | number>>

    const matrix: videoDataMatrix = []
    const combinations: Combination = []
    const maxUsage = app.settings.easy.maxVideoUsage
    const videosPerCombination = app.settings.easy.videosPerCombination

    // Initialize the matrix
    files.forEach(file => {
        matrix.push([file, 0])
    })

    // Generate combinations
    for (let i = 0; i < matrix.length; i++) {
        const combination: string[] = []
        let j = i
        while (combination.length < videosPerCombination && j < matrix.length) {
            // Check if video has not been used more than maxUsage times
            if ((matrix[j][1] as number) < maxUsage) {
                combination.push(matrix[j][0] as string)
                matrix[j][1] = (matrix[j][1] as number) + 1
            }
            j++
        }
        if (combination.length === videosPerCombination) {
            combinations.push(combination)
        }
    }

    /**
     * False is added to keep track which combinations have been made.
     * The first false array is the last one processed
     */
    combinations.forEach(combination => {
        combination.push(false)
    })

    // Shuffle the cominations if app.settings.easy.shuffle === true
    if (app.settings.easy.shuffle) {
        for (let i = combinations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combinations[i], combinations[j]] = [combinations[j], combinations[i]]
        }
    }

    return combinations
}