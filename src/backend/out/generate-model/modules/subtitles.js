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
export default async function subtitles(test, currentCombination, app, attempts) {
    if ((test.enabled && test.unitToTest === 'subtitles') || !test.enabled) {
        if (attempts.count <= 4) {
            attempts.count++;
            await main(currentCombination, app, test, attempts);
        }
        else {
            console.clear();
            console.log(chalk.redBright('Subtitles failed to generate after 5 attempts. Please review your script.'));
            breakLine;
            process.exit(1);
        }
    }
}
async function main(currentCombination, app, test, attempts) {
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
         * *Validate if its correct JSON
         */
        try {
            JSON.parse(fs.readFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), 'utf-8'));
        }
        catch {
            await subtitles(test, currentCombination, app, attempts);
            return;
        }
        /**
         * * Check if the app returned an error
         */
        try {
            const videoScriptContent = fs.readFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), 'utf-8');
            videoScript = JSON.parse(videoScriptContent);
        }
        catch (error) {
            console.error('Failed to parse JSON:', error);
            await subtitles(test, currentCombination, app, attempts);
            return;
        }
        /**
         * * Check if the script has incorrect formatting from the persepective that it has only one video despite the user wanting more than one
         */
        try {
            const videoScript = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), 'utf-8'));
            if (Object.keys(videoScript).length === 1 && app.settings.easy.videosPerCombination > 1) {
                await subtitles(test, currentCombination, app, attempts);
                return;
            }
        }
        finally {
            // Pass 
        }
        /**
         * * Check keys if they follow the correct naming system
         * * Rename them if they don't
         */
        try {
            const videoScript = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), 'utf-8'));
            const correctedVideoScript = {};
            Object.keys(videoScript).forEach((key, index) => {
                correctedVideoScript[`video${index + 1}`] = videoScript[key];
            });
            fs.writeFileSync(path.join(__dirname, '../../../files/generate-model/permanent/prompt.json'), JSON.stringify(correctedVideoScript, null, 4));
        }
        catch {
            await subtitles(test, currentCombination, app, attempts);
            return;
        }
    }
    attempts.count = 0;
}
