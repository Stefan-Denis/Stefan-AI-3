import fs from 'fs-extra';
import path from 'path';
/**
 * @param type can recieve `system` or `user` as a string.
 * @param currentCombination `(optional)` can recieve The current combination of videos.
 * @returns The Prompt
 */
export default async function constructPrompt(type, currentCombination, app) {
    /**
     * Formatted user prompt for either
     * `user` or `system`
     * @param `user prompt` requires the current combination of videos
     */
    let prompt = '';
    if (type === 'system') {
        /**
         * Formatted prompt for the system
         */
        prompt =
            `You are an AI assistant for Stefan-AI, an app that uses a powerful settings file and inputted videos to create short form content for TikTok and YouTube Shorts.
            Your task is to process the given video data and generate a JSON output that determines which videos should be used in the content creation process, and provide a message for each video.
            You have the following features at your disposal: Dynamic Video Selection, Min, Max & Preferred Length, Rules, Desired Output, General Theme, Video Themes.
            Based on these features, generate a JSON output in the following format: {"video1": {"isUsed": true, "message": "insert message here"}, "video2": {"isUsed": true, "message": "insert message here"}, "video3": {"isUsed": true, "message": "insert message here"}}.
            Remember, the number of objects in the output should match the number of videos provided in the prompt, also, if its convenient, you can make it so that the message splits on multiple videos, just add a property to the JSON named "extends" and set it to true if thats the case.`;
    }
    else if (type === 'user') {
        if (!currentCombination) {
            console.error('currentCombination is undefined for user prompt');
            process.exit(1);
        }
        // Determine video Themes
        const videoThemesPath = path.join(__dirname, '../', 'config', 'theme.json');
        const videoThemes = JSON.parse(fs.readFileSync(videoThemesPath, 'utf-8'));
        const videoDirPath = path.join(__dirname, '../', 'videos');
        const amountOfVideos = fs.readdirSync(videoDirPath).filter(file => path.extname(file) === '.mp4').length;
        /**
         * The video combination object
         */
        const videoCombination = {};
        for (let i = 1; i <= app.settings.easy.videosPerCombination; i++) {
            videoCombination[`video${i}`] = {
                theme: "",
            };
        }
        for (const key in videoCombination) {
            for (let x = 0; x < amountOfVideos; x++) {
                const video = currentCombination[parseInt(key.replace('video', '')) - 1];
                if (video === videoThemes[x][0]) {
                    videoCombination[key].theme = videoThemes[x][1];
                }
            }
        }
        let arrayOfThemes = [];
        for (const key in videoCombination) {
            arrayOfThemes.push(videoCombination[key].theme);
        }
        /**
         * Formatted user prompt for GPT
         */
        prompt =
            `I will need you to make a video script for the following videos:
            ${arrayOfThemes.map((theme, index) => `${index + 1}. ${theme}`).join('\n')}

            The general theme the videos need to respect:
            ${app.settings.advanced.generalTheme}

            Dynamic Video Selection: ${app.settings.easy.dynamicVideoSelection ? 'Enabled' : 'Disabled'}
            Desired Output: ${app.settings.advanced.desiredOutput}

            Information regarding how long you need to make the script in total:
            - Minimum length: ${app.settings.easy.length.min} seconds
            - Maximum length: ${app.settings.easy.length.max} seconds
            - Preferred length: ${app.settings.easy.length.preferred} seconds
            ! Current Voice Speaking Rate: 180 Words per Minute
            * Make sure to calculate how many words you can fit into each subtitle. Try to reach the limit
            * The time limit is for all clips length combined with their messages.

            Here are the rules you need to follow:
            ${app.promptRules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}
            Please process the videos and generate the subtitles for them in fluent english only.
            `;
    }
    return prompt;
}