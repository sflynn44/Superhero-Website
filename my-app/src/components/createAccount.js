import React, {useState}from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './createAccount.css';
import { removeTags } from './sanitization';

const CreateAccount = () => {
    const nav = useNavigate()

    let userName = localStorage.getItem("username")

    const [userN, setUN] = useState("")
    const [emailA, setEA] = useState("")
    const [passW, setP] = useState("")
    const [error1, setE1] = useState("")
    const [error2, setE2] = useState("")
    const [error3, setE3] = useState("")
    const [createE, setCE] = useState("")

    async function createA(userN, emailA, passW){
        try{
            const create = await fetch('/api/users/createUser', {
        
                method: "POST",
                  
                body: JSON.stringify({userN: userN, email: emailA, passW: passW}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!create.ok) {
                const j = await create.json()
                console.log("Response:", j.message);
                setCE(j.message)
                
            }else{
                const j = await create.json()
                console.log("Response:", j.message);
                setCE(j.message)

                nav('/')
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    const buttonClick = () => {
        
        setE1("")
        setE2("")
        setE3("")
        setCE("")

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

        setUN(removeTags(userN))
        setP(removeTags(passW))
        setEA(removeTags(emailA))

        
        createA(userN, emailA, passW)

    }

    return(

        <div className = "base">

            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search'>Search Heroes</Link>
                <Link to='/publicL'>Public Lists</Link>
                <Link to= '/customL'>Custom Lists</Link>
                <Link to='/accountS'>Account Settings</Link>
                <Link to='/login' className = "selected">Login</Link>
                <h3>{userName}</h3>
            </div>

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
                <label className="error">{createE}</label>

            </div>
        </div>

    )

}

export default CreateAccount