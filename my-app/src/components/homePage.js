import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './homePage.css';

const Home = () => {
    const nav = useNavigate()

    return (

        <div className = "base">

            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link>Search Heroes</Link>
                <Link>Public Lists</Link>
                <Link>Custom Lists</Link>
                <Link to='/updateP'>Account Settings</Link>
                <Link to='/login'>Login</Link>
                <Link>Log Out</Link>
            </div>

            <div className = "content">
                <h1>Welcome to SE3316 Superheroes</h1>
                <p>Little blurb about the site</p>
            </div>


        </div>
    )

}

export default Home