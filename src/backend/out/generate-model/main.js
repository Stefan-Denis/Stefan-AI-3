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
import * as commentJson from 'comment-json';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import ora from 'ora';
// Custom Imports
// Non-default
import { checkCrashFile } from './lib/crashManager.js';
import { startMessage } from './lib/startMessage.js';
import { checkDirs } from './lib/checkDirs.js';
import { Wait } from './lib/wait.js';
// Default
import crashHandler from './lib/crashManager.js';
import breakLine from './lib/breakLine.js';
import isValidProfile from './lib/validateProfile.js';
import trimVideos from './modules/trimVideos.js';
import concatVideos from './modules/concatVideos.js';
import parseTimings from './modules/parseTimings.js';
// Core app modules
import generateCombinations from './modules/generateCombinations.js';
import subtitles from './modules/subtitles.js';
import SSMLParser from './modules/SSMLParser.js';
import testTTSLength from './modules/testTTSLength.js';
// DotENV
import { config } from 'dotenv';
var Main;
(function (Main) {
    /**
     * * __DIRNAME VARIABLE
     * * Used to get the current directory of the app
     */
    const currentModuleUrl = new URL(import.meta.url);
    const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
    /**
     * * DotENV Config
     * * Loads the .env file
     * * Required for the app to run
     * * Sets GPT keys and Google API .json file location
     */
    config({ path: path.join(__dirname, '../../config/.env') });
    /**
     * * Assignment of the Profile File with all the user settings for processing.
     * * The most important feature of the app, uses the users settings to process the video.
     */
    const profile = (() => {
        try {
            const profileFile = fs.readdirSync('../../profiles')[0];
            const filePath = path.join(__dirname, '../../profiles', profileFile);
            const uncheckedProfile = commentJson.parse(fs.readFileSync(filePath, 'utf-8'));
            if (uncheckedProfile === null) {
                throw new Error('Profile data is null');
            }
            const isValid = isValidProfile(uncheckedProfile);
            return isValid ? uncheckedProfile : (() => { throw new Error('Invalid Profile'); })();
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    })();
    /**
     * * The main function of the app.
     * * Entry point of the app
     */
    async function main() {
        /**
         * * Config Folder Location
         */
        const configFolder = path.join(__dirname, '../../config');
        /**
         * ? Crash Handler Function
         * * Check if the app was running and crashed
         * * If it did, it will display that the app crashed and will skip generating combinations
         * * If it didn't, it will generate the combinations
         * * This is useful when the app crashes and you want to continue from the last combination
         * * App will then be set to be running
         */
        const crashFilePath = path.join(configFolder, 'crash.json');
        const crashStatus = await checkCrashFile(crashFilePath);
        await crashHandler('running', crashFilePath);
        /**
         * * Create the test variable
         * * created here to be used in early functions of the app
         */
        const test = JSON.parse(fs.readFileSync(path.join(configFolder, 'test.json'), 'utf-8'));
        /**
         * ? Start Message Function
         * * The app start message.
         */
        await startMessage(test);
        /**
         * ? Crash Message Function
         * * Check if the app crashed
         * * if it did, it will display that the app has crashed and will skip generating combinations
         */
        if (crashStatus) {
            await crashMessage();
        }
        /**
         * ? Check Directories Function
         * * Check if the required folders exist
         * * if they don't, the app will throw an error and force you to make them
         */
        await checkDirs();
        /**
         * ? Generate Combinations Function
         * ! TEST LABEL = "" (keep empty)
         * * Generate the combinations
         * * Generates only if the app did not crash
         * * if it did, it will skip generating combinations since it already has them
         * TODO: Add a check to see if there have been added other files, despite the app crashing
         */
        if (!crashStatus) {
            const spinner = ora('Generating Combinations').start();
            await generateCombinations(profile);
            await Wait.seconds(1.5);
            spinner.succeed('Combinations generated successfully!');
        }
        else {
            ora().start().succeed('Skipped generating combinations.');
        }
        // * Read the combinations file
        const combinationFilePath = path.join(configFolder, 'combinations.json');
        const combinations = JSON.parse(fs.readFileSync(combinationFilePath, 'utf-8'));
        /**
         * ? Main Processing
         * * Here is where the video gets edited
         * * Loops over videos inside the combination file
         */
        for (let x = 0; x < (test.runOnce ? 1 : combinations.length); x++) {
            /**
             * * Voice Variable
             * * for Google TTS API
             */
            const voice = 'en-US-Neural2-J';
            /**
             * * Logs the current combination to the console
             */
            console.log(`\n Combination: ${chalk.bgGreen(chalk.white(x + 1))}`);
            breakLine();
            /**
             * * Sets the current combination to a variable
             * * It is easier to access this way
             */
            const currentCombination = combinations[x];
            /**
             * * Check if the current combination is already processed
             * * If it is, it will skip to the next combination
             * * This is useful when the app crashes and you want to continue from the last combination
             */
            if (currentCombination[currentCombination.length - 1] === true) {
                continue;
            }
            /**
             * ? Subtitles Function
             * ! TEST LABEL = "subtitles"
             * * Generate the subtitles for the current combination
             * * Uses GPT API to generate the subtitles
             */
            const subtitlesSpinner = ora('Generating Subtitles').start();
            const subtitlesAttempts = 0;
            await subtitles(test, currentCombination, profile, subtitlesAttempts);
            subtitlesSpinner.succeed('Subtitles generated successfully!');
            /**
             * ? SSML Parser
             * ! TEST LABEL = "SSMLParser"
             * * Parses the text from the AI to SSML
             * * Used for Google TTS API
             */
            const SSMLSpinner = ora('Parsing SSML').start();
            await SSMLParser(test);
            SSMLSpinner.succeed('SSML parsed successfully!');
            /**
             * ? Test TTS length
             * ? Create TTS (side effect of the function)
             * ! TEST LABEL = "testTTSLength"
             * * Also generates TTS file for video
             */
            const testTTSLengthSpinner = ora('Checking Video Length').start();
            const length = await testTTSLength(test, voice);
            if (length > profile.settings.easy.length.max) {
                testTTSLengthSpinner.fail('Video script is too long, restarting!');
                /**
                 * * Attempt to delete the mp3 file
                 * * Only executes if the length exceeds the maximum
                 */
                try {
                    const tempAudioFilePath = path.join(__dirname, '../../files/generate-model/temporary/subtitles.mp3');
                    fs.unlinkSync(tempAudioFilePath);
                }
                catch (e) {
                    breakLine();
                    breakLine();
                    console.error(e);
                    breakLine();
                }
                x--;
                continue;
            }
            else {
                testTTSLengthSpinner.succeed('Video script length is good!');
            }
            /**
             * ? Trim Videos
             * ! TEST LABEL = "trimVideos"
             * * Trims the videos to the desired length.
             */
            const trimVideosSpinner = ora('Trimming Videos').start();
            await trimVideos(test, voice, currentCombination, profile);
            trimVideosSpinner.succeed('Videos trimmed successfully!');
            /**
             * ? Conact Videos
             * ! TEST LABEL = "concatVideos"
             * * Concatenates the videos together
             */
            const concatVideosSpinner = ora('Concatenating Videos').start();
            await concatVideos(test, profile);
            concatVideosSpinner.succeed('Videos concatenated successfully!');
            /**
             * ? Parse Timings
             * ! TEST LABEL = "parseTimings"
             * * Parses the timings for the subtitles
             * * Uses Montreal Forced Aligner to generate the timings
             */
            const parseTimingsSpinner = ora('Parsing Timings').start();
            const timings = await parseTimings(test, profile);
            parseTimingsSpinner.succeed('Timings parsed successfully!');
            breakLine();
            console.log(timings);
        }
        /**
         * * Close App
         */
        await crashHandler('not-running', crashFilePath);
    }
    Main.main = main;
    async function crashMessage() {
        console.log(chalk.yellowBright('Combinations were not generated because the app crashed or an error occoured during processing.'));
        console.log(chalk.yellowBright('Warning: ') + 'App will continue from previous combination.');
        breakLine();
    }
    Main.crashMessage = crashMessage;
})(Main || (Main = {}));
/**
 * * Entry point of the app
 * * Calls the main function
 */
await Main.main();
