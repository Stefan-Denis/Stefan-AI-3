/**
 * Represents the Profile Configuration File.
 */
export default interface Profile {
    /**
     * The name of the profile.
     */
    profileName: string

    /**
     * The prompt rules that will be given to the AI.
     */
    promptRules: Array<string>

    /**
     * The settings for the profile.
     */
    settings: {

        /**
         * The common settings for the profile.
         */
        easy: {

            /**
             * Whether to loop the video to create a seamless end to the video.
             */
            loop: boolean

            /**
             * Whether to shuffle the video clip order.
             */
            shuffle: boolean

            /**
             * How many times to use a certain video in combinations.
             * Should not be bigger than the amount of videos the app has been given
             */
            maxVideoUsage: number

            /**
             * How many videos can appear in a combination.
             * Should not be bigger than the amount of videos the app has been given
            */
            videosPerCombination: number

            /**
             * Use AI to allow the app to determine how many videos should actually be used for that combination.
              */
            dynamicVideoSelection: boolean

            /**
             * The length properties for the videos.
             */
            length: {
                /**
                 * The minimum length of the video in seconds.
                 */
                min: number

                /**
                 * The maximum length of the video in seconds.
                 */
                max: number

                /**
                 * The preferred length of the video in seconds.
                 */
                preferred: number
            }
        }

        /**
         * The advanced settings for the profile.
         */
        advanced: {

            /**
             * The maximum number of words that can appear on screen.
             * TODO: integrate in the future
             */
            maxWordsOnScreen: number

            /**
             * The desired output for the video script, which complements the prompt.
             * Leave empty for automatic output
             */
            desiredOutput: string

            /**
             * The transition settings for the video.
             */
            transitions: {
                /**
                 * Whether transitions are enabled.
                 */
                enabled: boolean
            }

            /**
             * The general theme for the video, which the app knows how to process.
             * E.g: Motivational, Reddit stores as of now.
             */
            generalTheme: string

            /**
             * Whether to upscale the video quality with an unsharp filter.
             */
            upscale: boolean

            /**
             * Whether to make the colors better.
             */
            colorful: boolean

            /**
             * The contrast of the video. Maximum and recommended value is 1.3.
             */
            contrast: number

            /**
             * Amount of CPU cores, used for processing certain video tasks
             * Used primarily for MFA task,
             */
            cpuCores: number
        }
    }
}