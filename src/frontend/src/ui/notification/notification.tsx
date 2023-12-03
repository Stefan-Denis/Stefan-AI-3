import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import successSound from './success.mp3'
import errorSound from './error.wav'

import './notification.css'

interface NotificationProps {
    message: string
    isError?: boolean
}

function Notification({ message, isError }: NotificationProps) {
    const duration = 3000

    useEffect(() => {
        const sound = new Audio(isError ? errorSound : successSound)
        sound.play().catch(error => console.log('playback error', error))

        const timer = setTimeout(() => {
            const container = document.getElementById('notification-root')
            if (container) {
                createRoot(container).unmount()
            }
        }, duration)
        return () => {
            clearTimeout(timer)
            sound.pause()
        }
    }, [message, isError, duration])

    return (
        <div className={`notification ${isError ? 'error' : ''}`}>
            {message}
        </div>
    )
}

let isNotificationPlaying = false

export function notify(message: string, isError: boolean = false) {
    // If a notification is already being displayed, return early
    if (isNotificationPlaying) {
        return
    }

    isNotificationPlaying = true

    const container = document.createElement('div')
    const root = createRoot(container)
    document.getElementById('notification-root')!.appendChild(container)

    root.render(
        <Notification message={message} isError={isError} />
    )

    setTimeout(() => {
        root.unmount()
        const notificationRoot = document.getElementById('notification-root')
        if (notificationRoot && notificationRoot.contains(container)) {
            notificationRoot.removeChild(container)
        }
        isNotificationPlaying = false
    }, 3000)
}