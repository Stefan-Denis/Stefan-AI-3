import { useState, ChangeEvent, FormEvent } from 'react'

import './add.css'

import { notify } from '../../../ui/notification/notification'

export default function Add() {
    /**
     * File submission
     */
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(event.target.files)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData()
        for (let file of selectedFiles!) {
            formData.append('video[]', file)
        }

        fetch('http://127.0.0.1:80/video/add', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then((data: ServerResponse) => {
                console.log(data)
                data.status === 200 ? notify(data.message) : notify(data.message, true)
            })
            .catch(error => {
                console.log(error)
            })

        document.getElementById('submit-add-videos-button')!.setAttribute('disabled', 'true')
        setTimeout(() => {
            document.getElementById('submit-add-videos-button')!.removeAttribute('disabled')
        }, 3100)
    }

    return (
        <div id='add-video-container'>
            <div className="card" id="add-video-card">
                <div className="card-header">
                    <h1 className="text-center">Upload Video</h1>
                </div>
                <div className="card-body">
                    <p>Must be 1080x1920 | 9:16 format</p>
                    <p>MP4 Only</p>
                    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data" id="addVideoForm">
                        <div className="form-group addVideoFormStyles">
                            <input type="file" className="form-control-file" id="video" name="video[]" accept=".mp4" multiple={true} required={true} onChange={handleFileChange} />
                        </div>
                        <div className="submit-parent">
                            <button type="submit" className="btn btn-primary float-right" id='submit-add-videos-button'>Upload</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}