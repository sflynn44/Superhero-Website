import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './login.css';
import { removeTags } from './sanitization';


const Login = () => {
    const nav = useNavigate()

    //get username to display
    let userN = localStorage.getItem("username")

    //create variables 
    const [email, setE] = useState("")
    const [passW, setP] = useState("")
    const [userE, setUE] = useState("")
    const [passwordE, setPE] = useState("")
    const [loginE, setLE] = useState("")
    const [verify, setV] = useState("")


    //function to log in 
    async function loginAccount(emailA, passW){
        try{
            const login = await fetch('/api/users/confirmLogin', {
        
                method: "POST",
                  
                body: JSON.stringify({email: emailA, passW: passW}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            //if error response print it  
            if (!login.ok) {
                const j = await login.json()
                console.log(j.message);
                setLE(j.message)

                //if error message is about verification direct the write path
                if(j.message == "Email has not been verified"){
                    setV(`Please click on the link to verify email`);
                }

            } else{
                //print success message 
                const j = await login.json()
                console.log(j.message);
                setLE(j.message)

                //set local storage with needed info
                localStorage.setItem("jwtToken", j.jwtToken);
                localStorage.setItem("email", email)
                localStorage.setItem("username", j.nickName)

                nav('/')
            }
        //if error with fetch print it 
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    //go to create account page 
    const buttonClick1 = () => {
        nav("/createA") 
    }

    const buttonClick = () => {
        
        setUE("")
        setPE("")
        setLE("")

        //ensure all required fields are filled in 
        if (email === "") {
            setUE("Please enter your email address")
            return
        }

        if (passW === "") {
            setPE("Please enter a password")
            return
        }

        //ensure email is valid 
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            setUE("Please enter a valid email")
        }

        //sanitize 
        setE(removeTags(email))
        setP(removeTags(passW))

        //log into account 
        loginAccount(email, passW)

    }

    return (

        <div className = "base">
            <div className ="sidebar">
                    <h2>Site Operations</h2>
                    <Link to='/search'>Search Heroes</Link>
                    <Link to='/publicL'>Public Lists</Link>
                    <Link to= '/customL'>Custom Lists</Link>
                    <Link to='/accountS'>Account Settings</Link>
                    <Link to='/login' className = "selected">Login</Link>
                    <Link to ='/pol'>Policies</Link>
                    <h3>{userN}</h3>
            </div>

            <div className = "main">

                <div className = "title">
                    <h1>Login</h1>
                </div>

                <div className = "userInput">
                    <form className = "input">
                        <input value={email} className = "i" id = "user"autocomplete="off" placeholder=" Enter Email..." onChange={userin => setE(userin.target.value)}/>
                    </form>
                    <label className="error">{userE}</label>
                </div>

                <div className = "userInput">
                    <form className = "input">
                        <input value={passW} className = "i" id = "pass"autocomplete="off" placeholder=" Enter Password..." onChange={passin => setP(passin.target.value)}/>
                    </form>
                    <label className="error">{passwordE}</label>
                </div>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick}>Enter</button>
                </div>
                <label className="error">{loginE}</label>
                {verify && (
                    <div className="verifyLink">
                        <p>{verify}</p>
                        <Link to={`/api/users/emailConfirmation/${email}`}>Verify Email</Link>
                    </div>
                )}

                <div className = "b1">
                    <button className = "button1" onClick = {buttonClick1}>Create Account</button>
                </div>

            </div>
        </div>
    )
}

export default Login;