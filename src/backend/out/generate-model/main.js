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
// Core app modules
import generateCombinations from './modules/generateCombinations.js';
import subtitles from './modules/subtitles.js';
// DotENV
import { config } from 'dotenv';
var Main;
(function (Main) {
    /**
     * __DIRNAME VARIABLE
     */
    const currentModuleUrl = new URL(import.meta.url);
    const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
    config({ path: path.join(__dirname, '../../config/.env') });
    /**
     * Assignment of the Profile File with all the user settings for processing.
     */
    const profile = (() => {
        try {
            const profileFile = fs.readdirSync('../../profiles')[0];
            const filePath = path.join(__dirname, '../../profiles', profileFile);
            return commentJson.parse(fs.readFileSync(filePath, 'utf-8'));
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
         * Set the app as running
         */
        const crashFilePath = path.join(__dirname, '../../config', 'crash.json');
        /**
         * Check if the app is running
         */
        const crashStatus = await checkCrashFile(crashFilePath);
        await crashHandler('running', crashFilePath);
        const test = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config', 'test.json'), 'utf-8'));
        await startMessage(test);
        if (crashStatus) {
            await crashMessage();
        }
        await checkDirs();
        /**
         * * Generate the combinations
         */
        if (!crashStatus) {
            const spinner = ora('Generating Combinations').start();
            const combinationFilePath = path.join(__dirname, '../../config', 'combinations.json');
            await generateCombinations(combinationFilePath, profile);
            await Wait.seconds(1.5);
            spinner.succeed('Combinations generated successfully!');
        }
        else {
            ora().start().succeed('Skipped generating combinations.');
        }
        /**
         * Main Processing
         */
        const combinationFilePath = path.join(__dirname, '../../config', 'combinations.json');
        const combinations = JSON.parse(fs.readFileSync(combinationFilePath, 'utf-8'));
        for (let x = 0; x < (test.runOnce ? 1 : combinations.length); x++) {
            console.log(`\n Combination: ${chalk.bgGreen(chalk.white(x + 1))}`);
            breakLine();
            const currentCombination = combinations[x];
            if (currentCombination[currentCombination.length - 1] === true) {
                continue;
            }
            /**
             * Generate subtitles
             */
            // const subtitlesSpinner = ora('Generating Subtitles').start()
            await subtitles(test, currentCombination, profile);
            // subtitlesSpinner.succeed('Subtitles generated successfully!')
        }
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
(async () => {
    await Main.main();
})();
