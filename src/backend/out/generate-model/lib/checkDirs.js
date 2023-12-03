import { notExists } from './notExists.js';
import path from 'path';
/**
 * Checks directories for existence.
 */
export async function checkDirs(config) {
    let allFoldersExist = true;
    for (const folder in config.folders) {
        const folderPath = config.folders[folder];
        if (notExists(path.join(folderPath))) {
            console.error(`Folder "${folderPath}" does not exist!`);
            allFoldersExist = false;
        }
    }
    if (!allFoldersExist) {
        process.exit(1);
    }
}
