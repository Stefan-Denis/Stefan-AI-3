import { notify } from '../../../ui/notification/notification'
import './start.css'


export default function Start() {

    const beginGenerating = () => {
        notify('Generating videos has started, a new window will open')
        fetch('http://127.0.0.1:80/startgeneration')
    }

    return (
        <div id='start-generating-container'>
            <h1>Start Generating Videos</h1>
            <p>Click the button below to start generating videos</p>
            <button className='btn btn-success' onClick={beginGenerating}>Start Generating</button>
        </div>
    )
}