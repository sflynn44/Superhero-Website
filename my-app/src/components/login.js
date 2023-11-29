import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './login.css';


const Login = () => {
    const nav = useNavigate()

    const [email, setE] = useState("")
    const [passW, setP] = useState("")
    const [userE, setUE] = useState("")
    const [passwordE, setPE] = useState("")
    const [loginE, setLE] = useState("")

    async function loginAccount(emailA, passW){
        try{
            const login = await fetch('/api/users/confirmLogin', {
        
                method: "POST",
                  
                body: JSON.stringify({email: emailA, passW: passW}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
                //check the response 
            if (!login.ok) {
                const j = await login.json()
                console.log(j.message);
                setLE(j.message)
            } else{
                const j = await login.json()
                console.log(j.message);
                setLE(j.message)

                localStorage.setItem("jwtToken", login.jwtToken)
                localStorage.setItem("email", email)

                nav('/')
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    const buttonClick1 = () => {
        nav("/createA") 
    }

    const buttonClick = () => {
        
        setUE("")
        setPE("")
        setLE("")

        if (email === "") {
            setUE("Please enter your email address")
            return
        }

        if (passW === "") {
            setPE("Please enter a password")
            return
        }

        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            setUE("Please enter a valid email")
        }

        loginAccount(email, passW)

    }

    return (

        <div className = "base">
            <div className ="sidebar">
                    <h2>Site Operations</h2>
                    <Link>Search Heroes</Link>
                    <Link>Public Lists</Link>
                    <Link>Custom Lists</Link>
                    <Link to='/updateP'>Account Settings</Link>
                    <Link to='/login' className = "selected">Login</Link>
                    <Link to='/'>Log out</Link>
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

                <div className = "b1">
                    <button className = "button1" onClick = {buttonClick1}>Create Account</button>
                </div>

            </div>
        </div>
    )
}

export default Login;