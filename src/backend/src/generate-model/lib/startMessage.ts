import breakLine from './breakLine.js'
import chalk from 'chalk'

export async function startMessage() {
    console.log(chalk.white('Stefan-AI'))
    console.log(chalk.whiteBright(' - Advanced Short-Form Video Generator - '))
    console.log(chalk.whiteBright(' - G3 System - '))
    breakLine()
    console.log(chalk.bgWhiteBright(chalk.blackBright('Version: 3.0')))
    breakLine()
}