import constructPrompt from '../lib/constructPrompt.js';
import path from 'path';
import OpenAI from 'openai';
import fs from 'fs-extra';
import chalk from 'chalk';
import breakLine from '../lib/breakLine.js';
/**
 * __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url);
const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1);
export default async function subtitles(test, currentCombination, app, subtitlesAttempts) {
    if ((test.enabled && test.unitToTest === 'subtitles') || !test.enabled) {
        if (subtitlesAttempts <= 8) {
            await main(currentCombination, app, test, subtitlesAttempts);
        }
        else {
            console.clear();
            chalk.redBright('Subtitles failed to generate after 8 attempts. Please review your script.');
            breakLine;
            process.exit(1);
        }
    }
}
async function main(currentCombination, app, test, subtitlesAttempts) {
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
            /**
             * Set to 0 after a successful run
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            subtitlesAttempts = 0;
        }
        catch (error) {
            console.error(error);
            // Restart the function
            // await main(currentCombination, app, test)
            // return
        }
    }
}
