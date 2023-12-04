import { notExists } from './notExists.js';
import path from 'path';
/**
 * __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
/**
 * Checks directories for existence.
 */
export async function checkDirs() {
    let allFoldersExist = true;
    // Check if the folders exist
    if (notExists(path.join(__dirname, '../../../config'))) {
        console.error('The config folder does not exist.');
        allFoldersExist = false;
    }
    if (notExists(path.join(__dirname, '../../../profiles'))) {
        console.error('The profiles folder does not exist.');
        allFoldersExist = false;
    }
    if (notExists(path.join(__dirname, '../../../videos'))) {
        console.error('The videos folder does not exist.');
        allFoldersExist = false;
    }
    if (!allFoldersExist) {
        process.exit(1);
    }
}
