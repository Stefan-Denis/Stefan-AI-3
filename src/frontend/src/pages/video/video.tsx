import React, { useState, Suspense } from 'react'
import './video.css'

const Add = React.lazy(() => import('./add/add'))
const Manage = React.lazy(() => import('./manage/manage'))
const Delete = React.lazy(() => import('./delete/delete'))
const Profiles = React.lazy(() => import('./profiles/profiles'))
const Start = React.lazy(() => import('./start/start'))

export default function Video() {
    const [activeButton, setActiveButton] = useState('Add')

    const renderComponent = () => {
        switch (activeButton) {
            case 'Add':
                return <Add />
            case 'Manage':
                return <Manage />
            case 'Delete':
                return <Delete />
            case 'Profiles':
                return <Profiles />
            case 'Start':
                return <Start />
            default:
                return null
        }
    }

    return (
        <div id="video-management-container">
            <div id='video-management-nav'>
                <div className={`video-management-nav-button start ${activeButton === 'Add' ? 'active' : ''}`} onClick={() => setActiveButton('Add')}>Add</div>
                <div className={`video-management-nav-button ${activeButton === 'Manage' ? 'active' : ''}`} onClick={() => setActiveButton('Manage')}>Manage</div>
                <div className={`video-management-nav-button ${activeButton === 'Delete' ? 'active' : ''}`} onClick={() => setActiveButton('Delete')}>Delete</div>
                <div className={`video-management-nav-button ${activeButton === 'Profiles' ? 'active' : ''}`} onClick={() => setActiveButton('Profiles')}>Profiles</div>
                <div className={`video-management-nav-button end ${activeButton === 'Start' ? 'active' : ''}`} onClick={() => setActiveButton('Start')}>Start</div>
            </div>
            <div id="video-management-main">
                <Suspense fallback={<div>Loading...</div>}>
                    {renderComponent()}
                </Suspense>
            </div>
        </div>
    )
}