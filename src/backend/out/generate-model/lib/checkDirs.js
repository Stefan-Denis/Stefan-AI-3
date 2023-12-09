/**
 * * Imports
 */
import { notExists } from './notExists.js';
import path from 'path';
/**
 * ? __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
/**
 * ? Check Directories Function
 * * Checks certain system-special directories for their existence.
 */
export async function checkDirs() {
    let allFoldersExist = true;
    /**
     * * Check if the config folder exists.
     */
    if (notExists(path.join(__dirname, '../../../config'))) {
        console.error('The config folder does not exist.');
        allFoldersExist = false;
    }
    /**
     * * Check if the profiles folder exists.
     */
    if (notExists(path.join(__dirname, '../../../profiles'))) {
        console.error('The profiles folder does not exist.');
        allFoldersExist = false;
    }
    /**
     * * Check if the prompts folder exists.
     */
    if (notExists(path.join(__dirname, '../../../videos'))) {
        console.error('The videos folder does not exist.');
        allFoldersExist = false;
    }
    /**
     * * If one of the folders does not exist.
     * * The application shuts off.
     */
    if (!allFoldersExist) {
        process.exit(1);
    }
}
