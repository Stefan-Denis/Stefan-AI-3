/**
 * ? isValidProfile function
 * * Checks if the given data is a valid Profile
 * * Uses an explicity `any` type to allow any JSON data
 * @param data Any JSON data
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isValidProfile(data: any): boolean {
    return data as boolean
        && typeof data.profileName === 'string'
        && Array.isArray(data.promptRules)
        && data.promptRules.every((rule: string) => typeof rule === 'string')
        && typeof data.settings === 'object'
        && typeof data.settings.easy === 'object'
        && typeof data.settings.easy.loop === 'boolean'
        && typeof data.settings.easy.shuffle === 'boolean'
        && typeof data.settings.easy.maxVideoUsage === 'number'
        && typeof data.settings.easy.videosPerCombination === 'number'
        && typeof data.settings.easy.dynamicVideoSelection === 'boolean'
        && typeof data.settings.easy.length === 'object'
        && typeof data.settings.easy.length.min === 'number'
        && typeof data.settings.easy.length.max === 'number'
        && typeof data.settings.easy.length.preferred === 'number'
        && typeof data.settings.advanced === 'object'
        && typeof data.settings.advanced.maxWordsOnScreen === 'number'
        && typeof data.settings.advanced.desiredOutput === 'string'
        && typeof data.settings.advanced.transitions === 'object'
        && typeof data.settings.advanced.transitions.enabled === 'boolean'
        && typeof data.settings.advanced.generalTheme === 'string'
        && typeof data.settings.advanced.upscale === 'boolean'
        && typeof data.settings.advanced.colorful === 'boolean'
        && typeof data.settings.advanced.contrast === 'number'
        && typeof data.settings.advanced.cpuCores === 'number'
}