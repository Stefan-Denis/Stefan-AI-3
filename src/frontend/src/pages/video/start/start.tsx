import { useEffect } from 'react'
import { notify } from '../../../ui/notification/notification'
import './start.css'


export default function Start() {

    const beginGenerating = () => {
        notify('Generating videos has started, a new window will open')
        fetch('http://127.0.0.1:80/startgeneration')
    }

    useEffect(() => {
        fetch('http://127.0.0.1:80/g3/info')
            .then(res => res.json())
            .then((data: any) => {
                console.log(data)
                const currentScript = data.currentScript
                document.getElementById('scriptName')!.innerHTML = currentScript
            })
    }, [])

    return (
        <div id='start-generating-container'>
            <div>
                <h1>Start Generating Videos</h1>
                <p>Click the button below to start generating videos</p>
                <table className="table customTable">
                    <thead>
                        <tr>
                            <th>Current Script</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id='scriptName'>Loading . . .</td>
                        </tr>
                    </tbody>
                </table>
                <button className='btn btn-success' onClick={beginGenerating}>Start Generating</button>
            </div>
        </div>
    )
}