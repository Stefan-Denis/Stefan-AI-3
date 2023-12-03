import { useEffect, useState } from 'react'

import './delete.css'

import { notify } from '../../../ui/notification/notification'

export default function Delete() {
    const [selectedVideos, setSelectedVideos] = useState<Array<string>>([])
    const [key, setKey] = useState<number>(0)

    const resetComponent = () => {
        setKey(prevKey => prevKey + 1)
    }

    useEffect(() => {
        fetch('http://localhost:80/videos/delete/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                const deleteVideoSelector = document.querySelector('#delete-video-selector')!
                deleteVideoSelector.innerHTML = ''

                res.data.forEach((video: string) => {
                    const videoSelector = document.createElement('div')
                    videoSelector.classList.add('delete-video-selector')
                    videoSelector.innerHTML = `<div class="video-delete-selector-name">${video}</div>`

                    videoSelector.addEventListener('click', () => {

                        if (videoSelector.classList.contains('active')) {
                            videoSelector.classList.remove('active')
                            setSelectedVideos(prevSelectedVideos => prevSelectedVideos.filter(v => v !== video))
                        } else {
                            videoSelector.classList.add('active')
                            setSelectedVideos(prevSelectedVideos => [...prevSelectedVideos, video])
                        }
                    })

                    deleteVideoSelector.appendChild(videoSelector)
                })
            })
    }, [key])

    const deleteSelectedClips = () => {
        if (selectedVideos.length === 0) return notify('No videos selected', true)

        fetch('http://localhost:80/videos/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videos: selectedVideos
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 200) {
                    resetComponent()
                    notify('Videos deleted successfully')
                    setSelectedVideos([])
                }
            })
    }

    return (
        <div id='delete-video-container' key={key}>
            <h1>Delete a video</h1>
            <button id='delete-video-button' onClick={deleteSelectedClips}>Delete <span>{selectedVideos.length}</span> videos</button>
            <div id='delete-video-selector'></div>
        </div>
    )
}