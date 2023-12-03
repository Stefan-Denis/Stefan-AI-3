import { subCombination } from '../@types/Combination.js'
import TestInterface from '../@types/TestInterface.js'
import Prompts from '../@types/Prompts.js'
import Profile from '../@types/Profile.js'

import constructPrompt from '../lib/constructPrompt.js'

import OpenAI from 'openai'

export default async function subtitles(test: TestInterface, currentCombination: subCombination, app: Profile) {
    if ((test.enabled && test.unitToTest === 'subtitles') || !test.enabled) {
        await main(currentCombination, app)
    }
}

async function main(currentCombination: subCombination, app: Profile) {
    const prompts: Prompts = {
        system: (await constructPrompt('system', currentCombination, app)).trimStart(),
        user: (await constructPrompt('user', currentCombination, app)).trimStart()
    }

    /**
     * The OpenAI Class.
     */
    const openai = new OpenAI({
        apiKey: process.env.GPT_KEY
    })
}