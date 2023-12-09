/**
 * * Node.JS Imports
*/
import chalk from 'chalk'

/**
 * * User Imports
 * * Type Definitions
 */
import TestInterface from '../@types/TestInterface.js'


/**
 * * User Imports
 * * Functions and Namespaces
 */
import breakLine from './breakLine.js'
import { Wait } from './wait.js'

/**
 * ? Start Message Function
 * * Prints out the start message for the application
 * @param test 
 * * type: TestInterface
 */
export async function startMessage(test: TestInterface) {

    /**
     * * Application Start Sequence
     */
    console.log(chalk.white('Stefan-AI'))
    console.log(chalk.whiteBright(' - Advanced Short-Form Video Generator - '))
    console.log(chalk.whiteBright(' - G3 System - '))
    breakLine()
    console.log(chalk.bgWhiteBright(chalk.blackBright('Version: 3.0')))
    breakLine()

    /**
     * * Test Mode
     * * Prints out the test mode messages
     */
    if (test.enabled) {
        breakLine()
        console.log(chalk.bgWhiteBright(chalk.blackBright('Test Mode Activated:')))
        breakLine()

        /**
         * * If the app is set to run once
         */
        if (test.runOnce) {
            console.log('Running' + chalk.yellow(' once'))
        }

        /**
         * * If the app has a certain unit to test
         */
        if (test.unitToTest !== '') {
            console.log('Testing ' + chalk.yellow(test.unitToTest))
        }

        /**
         * * If the app is set to skip the GPT script generation
         */
        if (test.skipGPT) {
            console.log('Skipping ' + chalk.yellow('GPT') + ' Script Generation')
        }

        /**
         * * If the app is set to update combinations
         */
        if (!test.updateCombinations) {
            console.log('Updating ' + chalk.yellow('Combinations') + chalk.red(' Disabled'))
        }

        /**
         * * Visual Formatting for CLI Interface
         */
        await Wait.seconds(1.5)
        breakLine()
    }
}