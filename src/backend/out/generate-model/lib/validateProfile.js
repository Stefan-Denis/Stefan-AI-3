/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ? isValidProfile function
 * * Checks if the given data is a valid Profile
 * * Uses an explicity `any` type to allow any JSON data
 * @param data Any JSON data
 * @returns true or false
 */
export default function isValidProfile(data) {
    return data
        /**
         * * Check if a profile name exists
         */
        && typeof data.profileName === 'string'
        /**
         * * Check if promptRules is an array
         */
        && Array.isArray(data.promptRules)
        /**
         * * Checks if the promptRules array contains only strings
         */
        && data.promptRules.every((rule) => typeof rule === 'string')
        /**
         * * Check if the settings object exists
         */
        && typeof data.settings === 'object'
        /**
         * * Check if the settings object contains the "easy" category of settings
         */
        && typeof data.settings.easy === 'object'
        /**
         * * Checks if the file contains the video looping setting
         */
        && typeof data.settings.easy.loop === 'boolean'
        /**
         * * Checks if the Profile contains the video shuffling setting
         */
        && typeof data.settings.easy.shuffle === 'boolean'
        /**
         * * Checks if the Profile contains the Maximum Video Usage setting
         */
        && typeof data.settings.easy.maxVideoUsage === 'number'
        /**
         * * Checks if the Profile contains the Videos Per Combination setting
         */
        && typeof data.settings.easy.videosPerCombination === 'number'
        /**
         * * Checks if the Profile contains the Dynamic Video Selection setting
         */
        && typeof data.settings.easy.dynamicVideoSelection === 'boolean'
        /**
         * * Checks if the Profile contains the Video Length settings
         */
        && typeof data.settings.easy.length === 'object'
        /**
         * * Checks if the Profile has the minimum length setting
         */
        && typeof data.settings.easy.length.min === 'number'
        /**
         * * Checks if the Profile has the maximum length setting
         */
        && typeof data.settings.easy.length.max === 'number'
        /**
         * * Checks if the Profile has the preferred length setting
         */
        && typeof data.settings.easy.length.preferred === 'number'
        /**
         * * Checks if the Profile contains the "advanced" category of settings
         */
        && typeof data.settings.advanced === 'object'
        /**
         * * Checks if the Profile contains the Max Words On Screen setting
         */
        && typeof data.settings.advanced.maxWordsOnScreen === 'number'
        /**
         * * Checks if the Profile contains the Desired Output setting
         */
        && typeof data.settings.advanced.desiredOutput === 'string'
        /**
         * * Checks if the Profile contains the Transitions setting
         */
        && typeof data.settings.advanced.transitions === 'object'
        /**
         * * Checks if the Profile contains the Transitions Enabled setting
         */
        && typeof data.settings.advanced.transitions.enabled === 'boolean'
        /**
         * * Checks if the Profile has the General Theme setting
         */
        && typeof data.settings.advanced.generalTheme === 'string'
        /**
         * * Checks if the app will have the setting to allow it to upscale videos
         */
        && typeof data.settings.advanced.upscale === 'boolean'
        /**
         * * Checks if the Profile Settings will let users make the video more colorful
         */
        && typeof data.settings.advanced.colorful === 'boolean'
        /**
         * * Checks if the Profile Settings has the option that makes the video more contrasted
         * * Can be also thought of as "more white" or "more bright"
         */
        && typeof data.settings.advanced.contrast === 'number'
        /**
         * * Checks if the Profile Settings has the option that tells the app how many Cores your CPU has
         * * This is used to correctly process in parallel certain things
         * * This is also used to correctly set the amount of the "concurrency" factor for video concatenation
         */
        && typeof data.settings.advanced.cpuCores === 'number';
}
