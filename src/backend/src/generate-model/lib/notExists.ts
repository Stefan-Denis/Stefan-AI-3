import fs from 'fs'

/**
 * Checks if a file does not exist.
 * @param file - The path to the file to check.
 * @type {string}
 * @returns A boolean indicating whether the file does not exist.
 * @since 2.0
 * @version 1.0
 * @example
 * ```ts
 * import { notExists } from './lib/notExists'
 * notExists('file.txt')
 * ```
 */
export function notExists(file: string) {
    return !fs.existsSync(file)
}