import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import './login.css';


const Login = () => {
    const nav = useNavigate()

    const buttonClick = () => {
        console.log("test")
    }

    return (
        <div className = "main">
            <div className = "title">
                <h1>Login</h1>
            </div>

            <form className = "input">
                <input className = "i" autocomplete="off" placeholder=" Enter Username..."></input>
            </form>

            <form className = "input">
                <input className = "i" autocomplete="off" placeholder=" Enter Password..."></input>
            </form>

            <div className = "b">
                <button className = "button" onClick = {buttonClick}>Enter</button>
            </div>

        </div>
    )
}

export default Login;