import React from "react"
import {useNavigate} from "react-router-dom"
import './basePage.css';


const Base = () => {
    const nav = useNavigate()

    const buttonClick = () => {
        //nav("./login")
        nav("/home") 
    }

    return (
        <div className = "test">
        <div className = "main">
            <div className = "title">
                <h1>SE3316 Superheroes</h1>
            </div>
            <div className = "summary">
                <p>This will be the summary of what the site does</p>
            </div>

            <div className = "b">
                <button className = "button" onClick = {buttonClick}>Login</button>
            </div>
        </div>
        </div>
    );
}

export default Base;