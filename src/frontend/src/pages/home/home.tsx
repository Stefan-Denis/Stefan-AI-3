import './home.css'

import Card from '../../ui/card'

export default function Home() {

    const timeOfDay = () => {
        const date = new Date()
        const hours = date.getHours()
        if (hours < 12) {
            return 'Morning'
        } else if (hours < 18) {
            return 'Afternoon'
        } else {
            return 'Evening'
        }
    }

    return (
        <div id='home-container'>
            <h1>Good {timeOfDay()}</h1>
            <div id='home-content-container'>
                <div id="cards">
                    <h1>Suggested actions</h1>
                    <div>
                        <Card title='AI / API' text='Modify the AI or API settings' link='AI-API'></Card>
                        <Card title='Video' text='Add, remove or modify video data, Create Videos automatically with the new Stefan-AI G3 System' link='video' button='Go to Videos'></Card>
                        <Card title='Image Generator' text='Generate images with the best image generator for short-form media, Powered By Stefan-AI I1 System' link='images' button='Go to Images'></Card>
                        <Card title='Calculate all possible video combinations' text='Calcualte all the possible video combinations with a precise mathematical formula' link='calculate' button='Calculate all Combinations'></Card>
                        <Card title='Repurpose Clips' text='Repurpose clips downloaded from the internet with the state-of-the-art Stefan-AI R1 System' link='repurpose' button='Start'></Card>
                    </div>
                </div>
            </div>
        </div>
    )
}