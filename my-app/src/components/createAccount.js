import React, {useState}from "react"
import {useNavigate} from "react-router-dom"
import './createAccount.css';

const CreateAccount = () => {
    const nav = useNavigate()

    const [userN, setUN] = useState("")
    const [emailA, setEA] = useState("")
    const [passW, setP] = useState("")
    const [error1, setE1] = useState("")
    const [error2, setE2] = useState("")
    const [error3, setE3] = useState("")

    const buttonClick = () => {
        
        setE1("")
        setE2("")
        setE3("")

        if(userN === ""){
            setE1("Please enter a username")
            return
        }

        if(emailA === ""){
            setE2("Please enter an email")
            return
        }

        if(passW === ""){
            setE3("Please enter a password")
            return
        }

        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailA)){
            setE2("Please enter a valid email")
        }
    }

    return(
        <div className = "main">

            <div className = "title">
                <h1>Create New Account</h1>
            </div>

            <div className = "newInput">
                <form className = "input">
                    <input value={userN} className = "i" id = "user"autocomplete="off" placeholder=" Enter username..." onChange={userName => setUN(userName.target.value)}/>
                </form>
                <label className="error">{error1}</label>
            </div>

            <div className = "newInput">
                <form className = "input">
                    <input value={emailA} className = "i" id = "user"autocomplete="off" placeholder=" Enter email address..." onChange={emailAddress => setEA(emailAddress.target.value)}/>
                </form>
                <label className="error">{error2}</label>
            </div>

            <div className = "newInput">
                <form className = "input">
                    <input value={passW} className = "i" id = "user"autocomplete="off" placeholder=" Enter password..." onChange={password => setP(password.target.value)}/>
                </form>
                <label className="error">{error3}</label>
            </div>

            <div className = "b">
                <button className = "button" onClick = {buttonClick}>Create Account</button>
            </div>


        </div>

    )

}

export default CreateAccount