import { useState, ChangeEvent, FormEvent } from 'react'

import './profiles.css'

import { notify } from '../../../ui/notification/notification'

export default function Theme() {
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
            formData.append('profile', file)
        }

        fetch('http://127.0.0.1:80/profile/add', {
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

        document.getElementById('submit-add-profile-button')!.setAttribute('disabled', 'true')
        setTimeout(() => {
            document.getElementById('submit-add-profile-button')!.removeAttribute('disabled')
        }, 3100)
    }

    return (
        <div id="profile-manager-container">
            <h1>Theme Manager</h1>
            <p>Only applied to <span id='span-AI-G3-Stefan-Label-profiles'>Stefan AI G3</span> <br /> Up to 1 file at a time. Previous files are backed up before overwriting </p>
            <div id='add-profile-config-file-container'>
                <div className="card" id="add-video-card">
                    <div className="card-header">
                        <h1 className="text-center">Add a Profile Config. File</h1>
                    </div>
                    <div className="card-body">
                        <p>”.jsonc” FILE ONLY</p>
                        <p>Single File Upload</p>
                        <form onSubmit={handleSubmit} method="post" encType="multipart/form-data" id="addVideoForm">
                            <div className="form-group addVideoFormStyles">
                                <input type="file" className="form-control-file" id="profile" name="profile" accept=".jsonc" required={true} onChange={handleFileChange} />
                            </div>
                            <div className="submit-parent">
                                <button type="submit" className="btn btn-primary float-right" id='submit-add-profile-button'>Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div id='select-profile-container'>

            </div>
        </div>
    )
}