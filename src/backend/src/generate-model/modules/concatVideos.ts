/**
 * * User Imports
 */
import TestInterface from '../@types/TestInterface.js'
import breakLine from '../lib/breakLine.js'
import Profile from '../@types/Profile.js'
import { Wait } from '../lib/wait.js'

/**
 * * Node.JS Imports
 */
import concat from 'ffmpeg-concat'
import fs from 'fs-extra'
import path from 'path'

/**
 * ? __dirname Variable
 */
const currentModuleUrl = new URL(import.meta.url)
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

/**
 * ? Concat Videos Function
 * * Concatenates all the videos in the temporary/trim folder into a single video.
 * @param test 
 * * type: TestInterface
 * @param profile 
 * * type: Profile
 */
export default async function concatVideos(test: TestInterface, profile: Profile) {

    /**
     * * Executes only if:
     * * If the test is enabled and set to test 'concat'
     * * Tests are disabled
     */
    if ((test.enabled && test.unitToTest === 'concatVideos') || !test.enabled) {

        // * Paths
        const trimDir = path.join(__dirname, '../../../files/generate-model/temporary/trim')
        const concatDir = path.join(__dirname, '../../../files/generate-model/temporary/concat')

        /**
         * * Video Files
         */
        const files = fs.readdirSync(trimDir).filter(file => path.extname(file) === '.mp4' && path.basename(file, '.mp4') !== 'loop') as Array<string>

        /**
         * * Empty the concat directory
         */
        fs.emptyDirSync(concatDir)

        /**
         * * Copy the loop video to the concat directory
         */
        if (profile.settings.easy.loop) {
            files.push('loop.mp4')
        }

        /**
         * ! The files are named in the order they should be concatenated.
         * ! the loop video is always last, thats why its added after. To ensure it is last.
         * ! Nothing shall change in The Video Trimming and Concatenation Process.
         */

        /**
         * * Output Path for the concatenated video
         */
        const outputPath = path.join(concatDir, 'output.mp4')

        try {
            /**
             * * Visual formatting
             */
            breakLine()
            await Wait.seconds(5)

            /**
             * * Concatenate the videos using advanced transitions by ffmpeg-concat
             */
            await concat({

                /**
                 * * Uses the number of CPU cores specified in the profile settings
                 */
                concurrency: profile.settings.advanced.cpuCores,

                /**
                 * * Output path
                 */
                output: outputPath,

                /**
                 * * Input videos
                 */
                videos: files.map(file => path.join(trimDir, file)),

                /**
                 * * Transition settings, based on Profile
                 */
                transition: profile.settings.advanced.transitions.enabled ? {
                    name: 'crosszoom',
                    duration: 300
                } : undefined,
            })
        } catch (error) {

            /**
             * * Application stops in case of an error
             * * Should usually never happen. 
             * * If it does, it is most likely a bug in the code or sudden low-level bug.
             */
            console.error(error)
            process.exit(1)
        }
    }
}