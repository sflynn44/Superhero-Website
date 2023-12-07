import React from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './accountSetting.css';


const Account = () => {
    const nav = useNavigate()

    let userN = localStorage.getItem("username")

    const buttonClick = () => {
        nav('/updateP')
    }

    const buttonClick1 = () => {
        nav('/grantA')
    }

    const buttonClick2 = () => {

        localStorage.clear()

        nav('/')
    }

    return (
        <div className = "test">

            <div className ="sidebar">
                    <h2>Site Operations</h2>
                    <Link to='/search'>Search Heroes</Link>
                    <Link to='/publicL'>Public Lists</Link>
                    <Link to= '/customL'>Custom Lists</Link>
                    <Link to='/accountS' className = "selected">Account Settings</Link>
                    <Link to='/login'>Login</Link>
                    <h3>{userN}</h3>
            </div>

            <div className = "main">

                <div className = "title">
                    <h1>Account Settings</h1>
                </div>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick}>Update Password</button>
                </div>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick1}>Admin Abilities</button>
                </div>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick2}>Log Out</button>
                </div>
            </div>
        </div>
    );
}

export default Account;