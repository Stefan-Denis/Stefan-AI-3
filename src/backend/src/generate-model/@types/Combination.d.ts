/**
 * ? Combination Type
 * * Represents the whole combinations for the video.
 */
export type Combination = Array<subCombination>

/**
 * ? SubCombination Type
 * * Represents an array that is inside the: @type Combination
 */
export type subCombination = Array<string | boolean>