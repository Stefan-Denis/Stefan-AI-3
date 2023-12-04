import breakLine from './breakLine.js';
import chalk from 'chalk';
import { Wait } from './wait.js';
export async function startMessage(test) {
    console.log(chalk.white('Stefan-AI'));
    console.log(chalk.whiteBright(' - Advanced Short-Form Video Generator - '));
    console.log(chalk.whiteBright(' - G3 System - '));
    breakLine();
    console.log(chalk.bgWhiteBright(chalk.blackBright('Version: 3.0')));
    breakLine();
    if (test.enabled) {
        breakLine();
        console.log(chalk.bgWhiteBright(chalk.blackBright('Test Mode Activated:')));
        breakLine();
        if (test.runOnce) {
            console.log('Running' + chalk.yellow(' once'));
        }
        if (test.unitToTest !== '') {
            console.log('Testing ' + chalk.yellow(test.unitToTest));
        }
        if (test.skipGPT) {
            console.log('Skipping ' + chalk.yellow('GPT') + ' Script Generation');
        }
        if (!test.updateCombinations) {
            console.log('Updating ' + chalk.yellow('Combinations') + chalk.red(' Disabled'));
        }
        await Wait.seconds(1.5);
        breakLine();
    }
}
