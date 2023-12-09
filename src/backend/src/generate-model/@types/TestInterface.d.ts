/**
 * ? Test Interface
 * @interface
 * @property {string} test - Test
 * @property {string} unitToTest - Input a unit to test from following list: 
 *  * - `subtitles` (add skipGPT to skip GPT prompt generation and set to `true`)
 *  * - `SSMLParser` 
 *  * - `TTS`
 *  * - `trimVideos`
 *  * - `concat`
 *  * - `parseTimings`
 *  * - `addSubtitles`
 *  * - `addAudios`
 *  * - `postFX`
 *  * - `addShake`
 */
export default interface TestInterface {
    enabled: boolean
    unitToTest: string
    skipGPT: true
    runOnce: boolean
    updateCombinations: boolean
}