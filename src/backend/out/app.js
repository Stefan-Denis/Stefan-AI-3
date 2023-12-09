/**
 * __DIRNAME VARIABLE
 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/*
 ╭──────────────────────────────────────────────────────────────╮
 │          File Overview and Version                           │
 │                                                              │
 ╰──────────────────────────────────────────────────────────────╯
*/
'use strict';
import { spawnSync } from 'child_process';
import { exec } from 'child_process';
import bodyParser from 'body-parser';
import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import cors from 'cors';
import path from 'path';
/*
 ╭──────────────────────────────────────────────────────────────╮
 │           Code                                               │
 │                                                              │
 ╰──────────────────────────────────────────────────────────────╯
*/
/**
 * @namespace
 * @description This is the main namespace for the TypeScript file.
 */
export var App;
(function (App) {
    const ffprobePath = path.join(__dirname, '../', 'bin', 'ffprobe.exe');
    function Main() {
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use(express.static(path.join(__dirname, '../../frontend/build')));
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
        });
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../', 'videos'));
            },
            filename: function (req, file, cb) {
                const filename = path.parse(file.originalname).name;
                const extension = path.parse(file.originalname).ext.toLowerCase();
                cb(null, `${filename}${extension}`);
            }
        });
        const upload = multer({ storage: storage });
        app.post('/video/add', upload.array('video[]'), async (req, res) => {
            const videos = req.files;
            try {
                const results = await Promise.all(videos.map(async (video) => {
                    const tempFilePath = video.path;
                    const is1080p = await isVideo1080p(tempFilePath);
                    if (is1080p) {
                        const finalFilePath = path.join(__dirname, '../', 'videos', video.filename);
                        await fs.promises.rename(tempFilePath, finalFilePath);
                        return true;
                    }
                    else {
                        await fs.promises.unlink(tempFilePath);
                        return false;
                    }
                }));
                const all1080p = results.every(result => result);
                if (all1080p) {
                    res.status(200).json({ message: 'All videos added successfully', status: 200, data: null });
                }
                else {
                    res.status(400).json({ message: 'Some videos were not 1080x1920', status: 400, data: null });
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Some videos were not 1080x1920', status: 500, data: err });
            }
            finally {
                try {
                    await appendThemeFile();
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
        app.get('/video/list', (req, res) => {
            fs.readdir(path.join(__dirname, '../', 'videos')).then(files => {
                res.status(200).json({ message: 'All videos listed successfully', status: 200, data: files });
            }).catch(err => {
                res.status(500).json({ message: 'Error listing videos', status: 500, data: err });
            });
        });
        app.post('/video/current-theme', (req, res) => {
            const themeFile = path.join(__dirname, '../config/themes.json');
            const themeFileData = JSON.parse(fs.readFileSync(themeFile, 'utf-8'));
            const selectedVideo = req.body.video;
            const themeFileSubArrayWithTheme = themeFileData.find(theme => theme[0] === selectedVideo);
            res.status(200).json({ message: 'Current theme retrieved successfully', status: 200, data: themeFileSubArrayWithTheme[1] });
        });
        app.get('/video/:videoId', (req, res) => {
            const videoId = req.params.videoId;
            // Assuming videos are stored in a 'videos' directory at the root
            const videoPath = path.join(__dirname, '../', 'videos', `${videoId}.mp4`);
            // Check if the video file exists
            fs.access(videoPath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(`Video file ${videoPath} does not exist`);
                    res.status(404).json({ message: 'Video not found', status: 404, data: null });
                }
                else {
                    res.sendFile(videoPath);
                }
            });
        });
        app.post('/video/theme-edit', (req, res) => {
            try {
                const body = req.body;
                const themeFile = path.join(__dirname, '../config/themes.json');
                const themeFileData = JSON.parse(fs.readFileSync(themeFile, 'utf-8'));
                // Find the array in the theme file that matches the selected video and update the theme
                const themeIndex = themeFileData.findIndex(theme => theme[0] === body.selectedVideo);
                themeFileData[themeIndex][1] = body.theme;
                fs.writeFileSync(themeFile, JSON.stringify(themeFileData, null, 2));
                res.status(200).json({ message: 'Theme updated successfully', status: 200, data: null });
            }
            catch (err) {
                res.status(500).json({ message: 'Error updating theme', status: 500, data: err });
            }
        });
        app.get('/videos/delete/list', (req, res) => {
            const videosPath = path.join(__dirname, '../videos');
            fs.readdir(videosPath).then(files => {
                res.status(200).json({ message: 'All videos listed successfully', status: 200, data: files });
            }).catch(err => {
                res.status(500).json({ message: 'Error listing videos', status: 500, data: err });
            });
        });
        app.post('/videos/delete', (req, res) => {
            const videosPath = path.join(__dirname, '../videos');
            const videosToDelete = req.body.videos;
            videosToDelete.forEach(video => {
                fs.unlink(path.join(videosPath, video), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            });
            res.status(200).json({ message: 'Videos deleted successfully', status: 200, data: null });
        });
        const profileStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../', 'profiles'));
            },
            filename: function (req, file, cb) {
                const filename = path.parse(file.originalname).name;
                const extension = path.parse(file.originalname).ext.toLowerCase();
                cb(null, `${filename}${extension}`);
            }
        });
        const uploadProfile = multer({ storage: profileStorage });
        app.post('/profile/add', moveExistingProfile, uploadProfile.single('profile'), (req, res) => {
            res.status(200).json({ message: 'Profile added successfully', status: 200, data: null });
        });
        function moveExistingProfile(req, res, next) {
            const profilesDir = path.join(__dirname, '../profiles');
            const backupDir = path.join(__dirname, '../backup');
            fs.readdirSync(profilesDir).forEach(file => {
                const sourcePath = path.join(profilesDir, file);
                const filename = path.parse(file).name;
                const extension = path.parse(file).ext;
                const timestamp = Date.now();
                const destPath = path.join(backupDir, `${filename}-${timestamp}${extension}`);
                fs.moveSync(sourcePath, destPath, { overwrite: true });
            });
            next();
        }
        app.get('/g3/info', async (req, res) => {
            const data = {
                currentScript: '',
            };
            /**
             * * Get the current profile
             */
            data.currentScript = fs.readdirSync(path.join(__dirname, '../profiles'))[0];
            /**
             * * Get the total potential combinations
             */
            res.json(data).status(200);
        });
        app.get('/startgeneration', (req, res) => {
            function callScript() {
                const scriptPath = path.join(__dirname, '../scripts/init.ps1');
                const result = spawnSync('powershell.exe', [scriptPath], { cwd: path.dirname(scriptPath) });
                if (result.error) {
                    console.error('Error:', result.error);
                    res.sendStatus(500);
                }
                else {
                    res.sendStatus(200);
                }
            }
            callScript();
        });
        app.listen(80, '127.0.0.1', () => {
            console.log('Server is running on port ' + '80');
        });
    }
    App.Main = Main;
    async function isVideo1080p(filePath) {
        return new Promise((resolve, reject) => {
            exec(`${ffprobePath} -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filePath}`, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject(new Error(stderr));
                    return;
                }
                const [width, height] = stdout.trim().split('x');
                resolve(width === '1080' && height === '1920');
            });
        });
    }
    App.isVideo1080p = isVideo1080p;
    async function appendThemeFile() {
        const themeFile = path.join(__dirname, '../config/themes.json');
        const videosPath = path.join(__dirname, '../videos');
        const themeFileData = JSON.parse(fs.readFileSync(themeFile, 'utf-8'));
        const files = fs.readdirSync(videosPath);
        files.forEach(file => {
            const themeExists = themeFileData.find(theme => theme[0] === file);
            if (!themeExists) {
                themeFileData.push([file, '']);
            }
        });
        fs.writeFileSync(themeFile, JSON.stringify(themeFileData, null, 2));
    }
    App.appendThemeFile = appendThemeFile;
})(App || (App = {}));
