/**
 * __DIRNAME VARIABLE
 */
const currentModuleUrl = new URL(import.meta.url)
export const __dirname = path.dirname(currentModuleUrl.pathname + '../').slice(1)


/*
 ╭──────────────────────────────────────────────────────────────╮
 │          File Overview and Version                           │
 │                                                              │
 ╰──────────────────────────────────────────────────────────────╯
*/

'use strict'

/**
 * @fileOverview Manages the front end and the backend.   
 *               App file will manage routing for node.js express. 
 * @version 3.0.0
 */

/*
 ╭──────────────────────────────────────────────────────────────╮
 │          Imports                                             │
 │                                                              │
 ╰──────────────────────────────────────────────────────────────╯
*/
import { Application } from 'express-serve-static-core'
import { spawnSync } from 'child_process'
import { exec } from 'child_process'
import bodyParser from 'body-parser'
import express from 'express'
import multer from 'multer'
import fs from 'fs-extra'
import cors from 'cors'
import path from 'path'

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
export namespace App {
    const ffprobePath = path.join(__dirname, '../', 'bin', 'ffprobe.exe')

    export function Main() {
        const app: Application = express()

        app.use(cors())
        app.use(bodyParser.json())
        app.use(express.static(path.join(__dirname, '../../frontend/build')))

        app.get('/', (req: express.Request, res: express.Response) => {
            res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'))
        })

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../', 'videos'))
            },
            filename: function (req, file, cb) {
                const filename = path.parse(file.originalname).name
                const extension = path.parse(file.originalname).ext.toLowerCase()
                cb(null, `${filename}${extension}`)
            }
        })

        const upload = multer({ storage: storage })

        app.post('/video/add', upload.array('video[]'), async (req: express.Request, res: express.Response) => {
            const videos = req.files as Express.Multer.File[]

            try {
                const results = await Promise.all(videos.map(async video => {
                    const tempFilePath = video.path
                    const is1080p = await isVideo1080p(tempFilePath)

                    if (is1080p) {
                        const finalFilePath = path.join(__dirname, '../', 'videos', video.filename)
                        await fs.promises.rename(tempFilePath, finalFilePath)
                        return true
                    } else {
                        await fs.promises.unlink(tempFilePath)
                        return false
                    }
                }))

                const all1080p = results.every(result => result)
                if (all1080p) {
                    res.status(200).json({ message: 'All videos added successfully', status: 200, data: null } as ServerResponse)
                } else {
                    res.status(400).json({ message: 'Some videos were not 1080x1920', status: 400, data: null } as ServerResponse)
                }
            } catch (err) {
                res.status(500).json({ message: 'Some videos were not 1080x1920', status: 500, data: err } as ServerResponse)
            } finally {
                try {
                    await appendThemeFile()
                } catch (err) {
                    console.error(err)
                }
            }
        })

        app.get('/video/list', (req: express.Request, res: express.Response) => {
            fs.readdir(path.join(__dirname, '../', 'videos')).then(files => {
                res.status(200).json({ message: 'All videos listed successfully', status: 200, data: files } as ServerResponse)
            }).catch(err => {
                res.status(500).json({ message: 'Error listing videos', status: 500, data: err } as ServerResponse)
            })
        })

        app.post('/video/current-theme', (req: express.Request, res: express.Response) => {
            const themeFile = path.join(__dirname, '../config/themes.json')
            const themeFileData: themeFileData = JSON.parse(fs.readFileSync(themeFile, 'utf-8'))

            const selectedVideo = req.body.video
            const themeFileSubArrayWithTheme = themeFileData.find(theme => theme[0] === selectedVideo)


            res.status(200).json({ message: 'Current theme retrieved successfully', status: 200, data: themeFileSubArrayWithTheme![1] } as ServerResponse)
        })

        app.get('/video/:videoId', (req, res) => {
            const videoId = req.params.videoId

            // Assuming videos are stored in a 'videos' directory at the root
            const videoPath = path.join(__dirname, '../', 'videos', `${videoId}.mp4`)

            // Check if the video file exists
            fs.access(videoPath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(`Video file ${videoPath} does not exist`)
                    res.status(404).json({ message: 'Video not found', status: 404, data: null })
                } else {
                    res.sendFile(videoPath)
                }
            })
        })

        app.post('/video/theme-edit', (req: express.Request, res: express.Response) => {
            interface themeEditRequest {
                selectedVideo: string
                theme: string
            }

            try {
                const body = req.body as themeEditRequest

                const themeFile = path.join(__dirname, '../config/themes.json')
                const themeFileData: themeFileData = JSON.parse(fs.readFileSync(themeFile, 'utf-8'))

                // Find the array in the theme file that matches the selected video and update the theme
                const themeIndex = themeFileData.findIndex(theme => theme[0] === body.selectedVideo)
                themeFileData[themeIndex][1] = body.theme

                fs.writeFileSync(themeFile, JSON.stringify(themeFileData, null, 2))

                res.status(200).json({ message: 'Theme updated successfully', status: 200, data: null } as ServerResponse)
            } catch (err) {
                res.status(500).json({ message: 'Error updating theme', status: 500, data: err } as ServerResponse)
            }
        })

        app.get('/videos/delete/list', (req: express.Request, res: express.Response) => {
            const videosPath = path.join(__dirname, '../videos')

            fs.readdir(videosPath).then(files => {
                res.status(200).json({ message: 'All videos listed successfully', status: 200, data: files } as ServerResponse)
            }).catch(err => {
                res.status(500).json({ message: 'Error listing videos', status: 500, data: err } as ServerResponse)
            })
        })

        app.post('/videos/delete', (req: express.Request, res: express.Response) => {
            const videosPath = path.join(__dirname, '../videos')

            const videosToDelete = req.body.videos as string[]

            videosToDelete.forEach(video => {
                fs.unlink(path.join(videosPath, video), err => {
                    if (err) {
                        console.error(err)
                    }
                })
            })

            res.status(200).json({ message: 'Videos deleted successfully', status: 200, data: null } as ServerResponse)
        })

        const profileStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../', 'profiles'))
            },
            filename: function (req, file, cb) {
                const filename = path.parse(file.originalname).name
                const extension = path.parse(file.originalname).ext.toLowerCase()
                cb(null, `${filename}${extension}`)
            }
        })

        const uploadProfile = multer({ storage: profileStorage })

        app.post('/profile/add', moveExistingProfile, uploadProfile.single('profile'), (req: express.Request, res: express.Response) => {
            res.status(200).json({ message: 'Profile added successfully', status: 200, data: null } as ServerResponse)
        })

        function moveExistingProfile(req: express.Request, res: express.Response, next: express.NextFunction) {
            const profilesDir = path.join(__dirname, '../profiles')
            const backupDir = path.join(__dirname, '../backup')

            fs.readdirSync(profilesDir).forEach(file => {
                const sourcePath = path.join(profilesDir, file)
                const filename = path.parse(file).name
                const extension = path.parse(file).ext
                const timestamp = Date.now()
                const destPath = path.join(backupDir, `${filename}-${timestamp}${extension}`)
                fs.moveSync(sourcePath, destPath, { overwrite: true })
            })

            next()
        }

        app.get('/startgeneration', (req: express.Request, res: express.Response) => {
            function callScript() {
                const scriptPath = path.join(__dirname, './generate-model/scripts/init.ps1')
                const result = spawnSync('powershell.exe', [scriptPath], { cwd: path.dirname(scriptPath) })

                if (result.error) {
                    console.error('Error:', result.error)
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200)
                }
            }

            callScript()
        })

        app.listen(80, '127.0.0.1', () => {
            console.log('Server is running on port ' + '80')
        })
    }

    export async function isVideo1080p(filePath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            exec(`${ffprobePath} -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filePath}`, (error, stdout, stderr) => {
                if (error) {
                    reject(error)
                    return
                }

                if (stderr) {
                    reject(new Error(stderr))
                    return
                }

                const [width, height] = stdout.trim().split('x')
                resolve(width === '1080' && height === '1920')
            })
        })
    }

    export async function appendThemeFile() {
        const themeFile = path.join(__dirname, '../config/themes.json')
        const videosPath = path.join(__dirname, '../videos')

        const themeFileData: themeFileData = JSON.parse(fs.readFileSync(themeFile, 'utf-8'))
        const files = fs.readdirSync(videosPath)

        files.forEach(file => {
            const themeExists = themeFileData.find(theme => theme[0] === file)

            if (!themeExists) {
                themeFileData.push([file, ''])
            }
        })

        fs.writeFileSync(themeFile, JSON.stringify(themeFileData, null, 2))
    }
}

/*
 ╭──────────────────────────────────────────────────────────────╮
 │          TYPES                                               │
 │ *Used for this file only* (route-specific types not included)│
 ╰──────────────────────────────────────────────────────────────╯
*/

/**
 * ServerResponse interface represents the structure of the response 
 * received from the server after making a request.
 */
interface ServerResponse {
    /**
     * The message received from the server. This could be a success 
     * message or an error message depending on the outcome of the request.
     */
    message: string

    /**
     * The HTTP status code of the response. This can be used to determine 
     * the outcome of the request. For example, a status of 200 means the 
     * request was successful, while a status of 404 means the requested 
     * resource could not be found.
     */
    status: number

    /**
     * The data received from the server. The type of this data can vary 
     * depending on the request, so it's typed as unknown.
     */
    data: unknown
}

/**
 * Theme file data type
 */
type themeFileData = Array<[string, string]>