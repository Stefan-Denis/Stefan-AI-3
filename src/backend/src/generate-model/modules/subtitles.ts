import { subCombination } from '../@types/Combination.js'
import TestInterface from '../@types/TestInterface.js'
import Prompts from '../@types/Prompts.js'
import Profile from '../@types/Profile.js'

import constructPrompt from '../lib/constructPrompt.js'
import path from 'path'

import OpenAI from 'openai'

import fs from 'fs-extra'
import { ChatCompletion } from 'openai/resources/index.mjs'
import chalk from 'chalk'
import breakLine from '../lib/breakLine.js'

/**
 * __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url)
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)

export default async function subtitles(test: TestInterface, currentCombination: subCombination, app: Profile, subtitlesAttempts: number) {
    if ((test.enabled && test.unitToTest === 'subtitles') || !test.enabled) {
        if (subtitlesAttempts <= 8) {
            await main(currentCombination, app, test, subtitlesAttempts)
        } else {
            console.clear()
            chalk.redBright('Subtitles failed to generate after 8 attempts. Please review your script.')
            breakLine
            process.exit(1)
        }
    }
}

async function main(currentCombination: subCombination, app: Profile, test: TestInterface, subtitlesAttempts: number) {
    const prompts: Prompts = {
        system: (await constructPrompt('system', currentCombination, app,)).trimStart(),
        user: (await constructPrompt('user', currentCombination, app)).trimStart()
    }

    /**
     * The OpenAI Class.
     */
    const openai = new OpenAI({
        apiKey: process.env.GPT_KEY
    })

    if (!test.skipGPT || !test.enabled) {
        try {
            let videoScript: ChatCompletion | string = await openai.chat.completions.create({
                messages: [
                    { 'role': 'system', 'content': prompts.system },
                    { 'role': 'user', 'content': prompts.user }
                ],
                model: 'ft:gpt-3.5-turbo-0613:tefan::8HXeI0yK',
                temperature: 1,
                max_tokens: 256
            })

            videoScript = videoScript.choices[0].message.content as unknown as string
            fs.writeFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), videoScript)

            /**
             * Set to 0 after a successful run
             */

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            subtitlesAttempts = 0
        }

        catch (error) {
            console.error(error)

            // Restart the function
            // await main(currentCombination, app, test)
            // return
        }
    }
}