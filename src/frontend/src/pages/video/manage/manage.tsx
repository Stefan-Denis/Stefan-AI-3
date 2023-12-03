import { useEffect, useState, useCallback } from 'react'
import { notify } from '../../../ui/notification/notification'
import './manage.css'

/**
 * Represents the response structure from the server.
 */
interface ServerResponse {
    status: number
    message: string
    data?: string[]
}

/**
 * Component for managing videos and their themes.
 */
export default function Manage() {
    const [selectedVideo, setSelectedVideo] = useState<string>('')
    const [theme, setTheme] = useState<string>('')

    /**
     * Retrieves the theme that is now for that video, if any.
     */
    const retrieveLastTheme = useCallback((video: string) => {
        fetch('http://127.0.0.1:80/video/current-theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                video: video,
            }),
        })
            .then(response => response.json())
            .then(data => {
                const theme = data.data
                if (data.status === 200) {
                    document.getElementById('last-updated-theme')!.innerHTML = theme
                } else {
                    document.getElementById('last-updated-theme')!.innerHTML = 'N/A'
                }
            })
    }, [])

    /**
     * Creates a video selector element.
     * @param {string} video - The video name.
     * @returns {HTMLDivElement} - The created video selector element.
     */
    const createVideoSelector = useCallback((video: string): HTMLDivElement => {
        const videoSelector = document.createElement('div')
        videoSelector.classList.add('video-selector')
        videoSelector.innerHTML = `<div class="video-selector-name">${video}</div>`

        videoSelector.addEventListener('click', () => handleVideoSelectorClick(video, videoSelector))
        videoSelector.addEventListener('click', () => {
            retrieveLastTheme(video)
        })

        return videoSelector
    }, [retrieveLastTheme])

    /**
     * Handles the response from the server after fetching the video list.
     * @param {ServerResponse} data - The response data from the server.
     */
    const handleVideoListResponse = useCallback((data: ServerResponse) => {
        const videos = data.data as Array<string>
        const videoSelectorContainer = document.getElementById('video-selector-container')!

        videoSelectorContainer.innerHTML = ''

        videos.forEach(video => {
            const videoSelector = createVideoSelector(video)
            videoSelectorContainer.appendChild(videoSelector)
        })
    }, [createVideoSelector])

    /**
     * Fetches the list of videos from the server.
     */
    const fetchVideoList = useCallback(() => {
        fetch('http://127.0.0.1:80/video/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(handleVideoListResponse)
    }, [handleVideoListResponse])

    /**
     * Handles the click event on a video selector.
     * @param {string} video - The selected video.
     * @param {HTMLDivElement} videoSelector - The video selector element.
     */
    const handleVideoSelectorClick = (video: string, videoSelector: HTMLDivElement) => {
        const videoSelectors = document.querySelectorAll('.video-selector')
        videoSelectors.forEach(vs => vs.classList.remove('active'))

        videoSelector.classList.add('active')
        setSelectedVideo(video)

        document.getElementById('selected-video-editor')!.innerHTML = `Selected Video: ${video}`
        document.getElementById('video-player-add-theme')!.setAttribute('src', `http://127.0.0.1:80/video/${video.replace(/\.mp4$/, '')}`)
    }

    useEffect(() => {
        fetchVideoList()
    }, [fetchVideoList])

    /**
     * Handles the click event on the "Add Theme" button.
     */
    const handleAddThemeClick = () => {
        if (selectedVideo && theme) {
            fetch('http://127.0.0.1:80/video/theme-edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedVideo: selectedVideo,
                    theme: theme,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    notify(data.message, data.status !== 200)
                    handleAddThemeResponse(data)
                    retrieveLastTheme(selectedVideo)
                })
        }
    }

    /**
     * Handles the response from the server after adding a theme.
     * @param {ServerResponse} data - The response data from the server.
     */
    const handleAddThemeResponse = (data: ServerResponse) => {
        if (data.status === 200) {
            notify(data.message)
        } else {
            notify('Theme could not be added', true)
        }
    }

    return (
        <div id='manage-videos-container'>
            <h1>Manage Videos</h1>
            <div id='video-selector-container'></div>
            <br />
            <div id="video-editor">
                <div id="video-display-container"><video id='video-player-add-theme' controls></video></div>
                <div id="text-editor-area-add">
                    <div>
                        <h1>Theme Editor</h1>
                        <p>Write the theme of the video in the following Editor <br /> Keep it as short and as concise as possible</p>
                        <p>Tips for best results:</p>
                        <ol>
                            <li>Add relavant information</li>
                            <li>Specify length of video, yet specify that the video can be as short as 2s</li>
                            <li>Keep short for lower cost of API</li>
                        </ol>
                        <textarea name="" id="theme-info-add" rows={10} onChange={(e) => setTheme(e.target.value)}></textarea>
                        <button
                            id="add-theme-info"
                            className='add-theme-button'
                            onClick={handleAddThemeClick}>
                            Add Theme
                        </button>
                    </div>
                </div>
            </div>
            <div id='video-theme-container'>
                <h1 id='selected-video-editor'>Selected Video: {selectedVideo || 'N/A'}</h1>
                <h1 id='current-theme-label'>Current theme:</h1>
                <p id='last-updated-theme'></p>
            </div>
        </div>
    )
}
