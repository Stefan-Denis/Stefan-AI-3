/**
 * Represents the status of the crash handler.
 */
type crashHandlerStatus = boolean

import fs from 'fs-extra'
import path from 'path'

/**
 * Handles the crash state of the application by writing a boolean value to a file.
 * @param state The state of the application, either 'running' or 'not-running'.
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

export async function checkCrashFile(crashFile: string): Promise<crashHandlerStatus> {
    const crashFileData = JSON.parse(fs.readFileSync(crashFile, 'utf-8'))
    return crashFileData.crash
}