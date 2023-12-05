import fs from 'fs-extra'
import path from 'path'

import Profile from '../@types/Profile.d.js'
import { Combination } from '../@types/Combination.js'
import breakLine from '../lib/breakLine.js'
import chalk from 'chalk'
import crashHandler from '../lib/crashManager.js'

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
export default async function generateCombinations(appSettings: Profile) {
    // Clear the directory where the output videos are saved
    fs.emptyDirSync(path.join(__dirname, '../../../../../output/generated-videos'))

    // Grab all the videos
    const videoPath = path.join(__dirname, '../../../videos')
    const files: Array<string> = fs.readdirSync(videoPath).filter(file => path.extname(file) === '.mp4')

    const permutations: Combination = await generatePermutations(appSettings, files)

    /* try {
        fs.writeFileSync(path.join(__dirname, '../../../config/combinations.json'), JSON.stringify(permutations, null, 4))
    } catch (e) {
        console.error(e)
        process.exit(1)
    } */
}

/**
 * Generates all the possible combinations of the videos.
 * @param appSettings The user settings
 * @param files The videos
 * @summary This is a very complex algorithm, it generates all the possible combinations of the videos with some rules.
 * 
 */
async function generatePermutations(app: Profile, files: Array<string>): Promise<Combination> {

    // * Parameters
    const combinations: string[][] = []
    const maxUsage = app.settings.easy.maxVideoUsage
    const videosPerCombination = app.settings.easy.videosPerCombination

    if (videosPerCombination > files.length) {
        console.clear()
        console.log(chalk.bgRedBright('ERROR:'))
        console.log(chalk.redBright('The amount of videos is greater than the amount of videos per combination.'))
        console.log(chalk.redBright('Please change the amount of videos per combination in the profile file.'))

        crashHandler('not-running', path.join(__dirname, '../../../config/crash.json'))
        process.exit(1)
    }

    // * Limit definitions
    const matrix: Array<Array<string | number>> = []
    const filesToNotUse: Array<string> = []
    const usageCount: { [key: string]: number } = {}

    // * Matrix generator
    files.forEach((file) => {
        matrix.push([file, 0])
    })

    /**
     * * Create absolutely all possible video combinations for future processing
     */
    for (let i = 0; i < files.length; i++) {
        const combination: string[] = []
        for (let j = 0; j < videosPerCombination; j++) {
            const randomIndex = Math.floor(Math.random() * files.length)
            const randomFile = files[randomIndex]
            if (!combination.includes(randomFile)) {
                combination.push(randomFile)
            } else {
                j--
            }
        }
        combinations.push(combination)
    }

    breakLine()
    console.log('Matrix:')
    console.log(matrix)
    breakLine()
    console.log('Combinations:')
    console.log(combinations)
    breakLine()

    return combinations
}