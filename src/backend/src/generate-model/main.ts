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
import TestInterface from './@types/TestInterface.js'
import { Combination } from './@types/Combination.js'

// Core app modules
import generateCombinations from './modules/generateCombinations.js'
import subtitles from './modules/subtitles.js'
import SSMLParser from './modules/SSMLParser.js'

// DotENV
import { config } from 'dotenv'


namespace Main {
    /**
     * * __DIRNAME VARIABLE
     * * Used to get the current directory of the app
     */
    const currentModuleUrl = new URL(import.meta.url)
    const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

    /**
     * * DotENV Config
     * * Loads the .env file
     * * Required for the app to run
     * * Sets GPT keys and Google API .json file location
     */
    config({ path: path.join(__dirname, '../../config/.env') })

    /**
     * * Assignment of the Profile File with all the user settings for processing.
     * * The most important feature of the app, uses the users settings to process the video.
     */
    const profile: Profile = (() => {
        try {
            const profileFile = fs.readdirSync('../../profiles')[0]
            const filePath = path.join(__dirname, '../../profiles', profileFile)
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
         * ? Crash Handler Function
         * * Check if the app was running and crashed
         * * If it did, it will display that the app crashed and will skip generating combinations
         * * If it didn't, it will generate the combinations
         * * This is useful when the app crashes and you want to continue from the last combination
         * * App will then be set to be running
         */
        const crashFilePath = path.join(__dirname, '../../config', 'crash.json')
        const crashStatus: boolean = await checkCrashFile(crashFilePath)
        await crashHandler('running', crashFilePath)

        /**
         * * Create the test variable
         * * created here to be used in early functions of the app
         */
        const test: TestInterface = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config', 'test.json'), 'utf-8'))

        /**
         * ? Start Message Function
         * * The app start message. 
         */
        await startMessage(test)

        /**
         * ? Crash Message Function
         * * Check if the app crashed
         * * if it did, it will display that the app has crashed and will skip generating combinations
         */
        if (crashStatus) {
            await crashMessage()
        }

        /**
         * ? Check Directories Function
         * * Check if the required folders exist
         * * if they don't, the app will throw an error and force you to make them
         */
        await checkDirs()

        /**
         * ? Generate Combinations Function
         * ! TEST LABEL = "" (keep empty)
         * * Generate the combinations
         * * Generates only if the app did not crash
         * * if it did, it will skip generating combinations since it already has them
         * TODO: add a check to see if there have been added other files, despite the app crashing
         */
        if (!crashStatus) {
            const spinner = ora('Generating Combinations').start()

            await generateCombinations(profile)
            await Wait.seconds(1.5)

            spinner.succeed('Combinations generated successfully!')
        } else {
            ora().start().succeed('Skipped generating combinations.')
        }


        // * Read the combinations file
        const combinationFilePath = path.join(__dirname, '../../config', 'combinations.json')
        const combinations: Combination = JSON.parse(fs.readFileSync(combinationFilePath, 'utf-8'))

        /**
         * ? Main Processing
         * * Here is where the video gets edited
         * * Loops over videos inside the combination file
         */
        for (let x = 0; x < (test.runOnce ? 1 : combinations.length); x++) {

            /**
             * * Logs the current combination to the console
             */
            console.log(`\n Combination: ${chalk.bgGreen(chalk.white(x + 1))}`)
            breakLine()

            /**
             * * Sets the current combination to a variable
             * * It is easier to access this way
             */
            const currentCombination = combinations[x]

            /**
             * * Check if the current combination is already processed
             * * If it is, it will skip to the next combination
             * * This is useful when the app crashes and you want to continue from the last combination
             */
            if (currentCombination[currentCombination.length - 1] === true) {
                continue
            }

            /**
             * ? Subtitles Function 
             * ! TEST LABEL = "subtitles"
             * * Generate the subtitles for the current combination
             * * Uses GPT API to generate the subtitles
             */
            const subtitlesSpinner = ora('Generating Subtitles').start()
            const subtitlesAttempts: number = 0
            await subtitles(test, currentCombination, profile, subtitlesAttempts)
            subtitlesSpinner.succeed('Subtitles generated successfully!')

            /**
             * ? SSML Parser
             * ! TEST LABEL = "SSMLParser"
             * * Parses the text from the AI to SSML
             * * Used for Google TTS API
             */
            const SSMLSpinner = ora('Parsing SSML').start()
            await SSMLParser(test)
            SSMLSpinner.succeed('SSML parsed successfully!')
        }

        /**
         * * Close App
         */
        await crashHandler('not-running', crashFilePath)
    }

    export async function crashMessage() {
        console.log(chalk.yellowBright('Combinations were not generated because the app crashed or an error occoured during processing.'))
        console.log(chalk.yellowBright('Warning: ') + 'App will continue from previous combination.')
        breakLine()
    }
}

/**
 * * Entry point of the app
 * * Calls the main function
 */
await Main.main()