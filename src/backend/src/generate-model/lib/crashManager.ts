/**
 * * Node.JS Imports
 */
import fs from 'fs-extra'

/**
 * * Crash Handler Status Type Import
 */
import { crashHandlerStatus } from '../@types/crashHandler.js'

/**
 * ? CrashHandler Function
 * * Handles the crash state of the application by writing a boolean value to a file.
 * @param state 
 * * Can recieve `running` or `not-running` as a string.
 */
export default async function crashHandler(state: string, crashFile: string) {
    if (state === 'running') {
        const crashFileData = JSON.parse(fs.readFileSync(crashFile, 'utf-8'))
        crashFileData.crash = true
        fs.writeFileSync(crashFile, JSON.stringify(crashFileData, null, 4))
    } else if (state === 'not-running') {
        const crashFileData = JSON.parse(fs.readFileSync(crashFile, 'utf-8'))
        crashFileData.crash = false
        fs.writeFileSync(crashFile, JSON.stringify(crashFileData, null, 4))
    } else {
        throw new Error(`Invalid state "${state}"`)
    }
}

/**
 * * Checks the crash file to see if the application has crashed.
 * @returns The status of the crash handler.
 */
export async function checkCrashFile(crashFile: string): Promise<crashHandlerStatus> {
    const crashFileData = JSON.parse(fs.readFileSync(crashFile, 'utf-8'))
    return crashFileData.crash
}