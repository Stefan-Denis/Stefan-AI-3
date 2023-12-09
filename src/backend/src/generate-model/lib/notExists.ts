/**
 * * Imports
 */
import fs from 'fs-extra'

/**
 * ? NotExists Function
 * * Checks if a file does not exist.
 * @param file - The path to the file to check.
 * @type {string}
 * @returns A boolean indicating whether the file does not exist.
 * @example
 * ```ts
 * import { notExists } from './lib/notExists'
 * notExists('file.txt')
 * ```
 */
export function notExists(file: string): boolean {
    return !fs.existsSync(file)
}