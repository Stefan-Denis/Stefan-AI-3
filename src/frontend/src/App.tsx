import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './App.css'
import './nav-button.css'

import Home from "./pages/home/home"
import Video from "./pages/video/video"

export default function App() {
    return (
        <Router>
            <div id="container">
                <nav>
                    <h1>Stefan AI</h1>
                    <Link to='/'><button type="button" className="nav-button" >Home</button></Link>
                    <Link to='/video'><button type="button" className="nav-button" >Generator 3 System</button></Link>
                    <Link to='/repurpose'><button type="button" className="nav-button" >Repurpose Clips</button></Link>
                    <Link to='/'><button type="button" className="nav-button" >75% Auto Edit</button></Link>
                    <Link to='/'><button type="button" className="nav-button" >Reddit Stories</button></Link>
                    <Link to='/'><button type="button" className="nav-button" >Funny Moments</button></Link>
                </nav>
                <main>
                    <div>
                        <Routes>
                            <Route path='/' element={<Home></Home>} />
                            <Route path='/video' element={<Video></Video>} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    )
}