/**
 * @file Main file of the Stefan AI G3 System
 * 
 * @requiredFolders
 * - @config folder
 *   - crash.json
 *   - test.json
 *   - themes.json
 *   - combinations.json
 *   - google.json
 *   - .env
 * - @Profiles folder
 *   - *.jsonc file
 * - @Videos folder
 *   - *.mp4 file
 * 
 * @author Ștefan Denis
 * @since 1.0
 * @version 3.0
 *  
 * @remarks
 * Respect the folder order when migrating to other projects.
 * Keep code clean and readable.
 * Use config.json to tell the app where the 
 */

// Node.JS
import * as commentJson from 'comment-json'
import fs from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import ora from 'ora'

// Custom Imports
// Non-default
import { checkCrashFile } from './lib/crashManager.js'
import { startMessage } from './lib/startMessage.js'
import { checkDirs } from './lib/checkDirs.js'
import { Wait } from './lib/wait.js'

// Default
import crashHandler from './lib/crashManager.js'
import breakLine from './lib/breakLine.js'

// Interfaces
import Profile from './@types/Profile.d.js'
import MainConfig from './@types/mainconfig.d.js'
import TestInterface from './@types/TestInterface.js'
import { Combination } from './@types/Combination.js'

// Core app modules
import generateCombinations from './modules/generateCombinations.js'
import subtitles from './modules/subtitles.js'

namespace Main {
    /**
     * __DIRNAME VARIABLE
     */
    const currentModuleUrl = new URL(import.meta.url)
    const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

    /**
     * Assignment of the config file to a variable.
     */
    const config: MainConfig = (() => {
        try {
            return JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
        } catch (e) {
            console.error(e)
            process.exit(1)
        }
    })()

    /**
     * Assignment of the Profile File with all the user settings for processing.
     */
    const profile: Profile = (() => {
        try {
            const profileFile = fs.readdirSync(config.folders.profiles)[0]
            const filePath = path.join(__dirname, config.folders.profiles, profileFile)
            return commentJson.parse(fs.readFileSync(filePath, 'utf-8')) as unknown as Profile
        } catch (e) {
            console.error(e)
            process.exit(1)
        }
    })()

    /**
     * * The main function of the app.
     * * Entry point of the app
     */
    export async function main() {
        /**
         * Set the app as running
         */
        const crashFilePath = path.join(__dirname, config.folders.config, 'crash.json')

        /**
         * Check if the app is running
         */
        const crashStatus: boolean = await checkCrashFile(crashFilePath)
        await crashHandler('running', crashFilePath)
        await checkDirs(config)

        await startMessage()

        if (crashStatus) {
            await crashMessage()
        }

        /**
         * * Generate the combinations
         */
        if (!crashStatus) {
            const spinner = ora('Generating Combinations').start()

            const combinationFilePath = path.join(__dirname, config.folders.config, 'combinations.json')

            await generateCombinations(combinationFilePath, profile)
            await Wait.seconds(1.5)

            spinner.succeed('Combinations generated successfully!')
        } else {
            ora().start().succeed('Skipped generating combinations.')
        }

        /**
         * Main Processing
         */
        const combinationFilePath = path.join(__dirname, config.folders.config, 'combinations.json')
        const combinations: Combination = JSON.parse(fs.readFileSync(combinationFilePath, 'utf-8'))
        const test: TestInterface = JSON.parse(fs.readFileSync(path.join(__dirname, config.folders.config, 'test.json'), 'utf-8'))

        for (let x = 0; x < (test.runOnce ? 1 : combinations.length); x++) {
            console.log(`\n Combination: ${chalk.bgGreen(chalk.white(x + 1))}`)

            const currentCombination = combinations[x]

            if (currentCombination[currentCombination.length - 1] === true) {
                continue
            }

            /**
             * Generate subtitles
             */
            await subtitles(test, currentCombination, profile)
        }

        await crashHandler('not-running', crashFilePath)
    }

    export async function crashMessage() {
        console.log(chalk.yellowBright('Combinations were not generated because the app crashed or an error occoured during processing.'))
        console.log(chalk.yellowBright('Warning: ') + 'App will continue from previous combination.')
        breakLine()
    }


}

(async () => {
    await Main.main()
})()