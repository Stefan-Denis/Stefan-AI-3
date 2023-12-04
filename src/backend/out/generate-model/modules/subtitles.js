import constructPrompt from '../lib/constructPrompt.js';
import path from 'path';
import OpenAI from 'openai';
import fs from 'fs-extra';
/**
 * __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
export default async function subtitles(test, currentCombination, app) {
    if ((test.enabled && test.unitToTest === 'subtitles') || !test.enabled) {
        await main(currentCombination, app, test);
    }
}
async function main(currentCombination, app, test) {
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
    if (!test.skipGPT || !test.enabled) {
        try {
            let videoScript = await openai.chat.completions.create({
                messages: [
                    { 'role': 'system', 'content': prompts.system },
                    { 'role': 'user', 'content': prompts.user }
                ],
                model: 'ft:gpt-3.5-turbo-0613:tefan::8HXeI0yK',
                temperature: 1,
                max_tokens: 256
            });
            videoScript = videoScript.choices[0].message.content;
            fs.writeFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), videoScript);
        }
        catch (error) {
            console.error(error);
            // Restart the function
            // await main(currentCombination, app, test)
            // return
        }
    }
}
