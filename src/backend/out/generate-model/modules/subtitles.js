import constructPrompt from '../lib/constructPrompt.js';
import OpenAI from 'openai';
export default async function subtitles(test, currentCombination, app) {
    if ((test.enabled && test.unitToTest === 'subtitles') || !test.enabled) {
        await main(currentCombination, app);
    }
}
async function main(currentCombination, app) {
    const prompts = {
        system: (await constructPrompt('system', currentCombination, app)).trimStart(),
        user: (await constructPrompt('user', currentCombination, app)).trimStart()
    };
    /**
     * The OpenAI Class.
     */
    const openai = new OpenAI({
        apiKey: process.env.GPT_KEY
    });
}
