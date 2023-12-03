import { notExists } from './notExists.js'

import MainConfig from '../@types/mainconfig.js'
import path from 'path'

/**
 * Checks directories for existence.
 */
export async function checkDirs(config: MainConfig) {
    let allFoldersExist = true

    for (const folder in config.folders) {
        const folderPath = config.folders[folder as keyof MainConfig['folders']]
        if (notExists(path.join(folderPath))) {
            console.error(`Folder "${folderPath}" does not exist!`)
            allFoldersExist = false
        }
    }

    if (!allFoldersExist) {
        process.exit(1)
    }
}