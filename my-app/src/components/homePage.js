import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './homePage.css';

const Home = () => {
    const nav = useNavigate()

    let userN = localStorage.getItem("email")

    if(userN == "admin123@gmail.com"){
        userN = "Admin"
    }

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
                <h3>{userN}</h3>
            </div>

            <div className = "content">
                <h1>Welcome to SE3316 Superheroes</h1>
                <p>Little blurb about the site</p>
            </div>


        </div>
    )

}

export default Home