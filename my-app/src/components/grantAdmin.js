import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './grantAdmin.css';


const Grant = () => {
    const nav = useNavigate()

    const [email, setE] = useState("")
    const [userE, setUE] = useState("")

    async function granting(email){

        let admin = localStorage.getItem("email")
        console.log(admin)

        try{
            const grant = await fetch('/api/users/grantAdmin', {
        
                method: "POST",
                  
                body: JSON.stringify({email: email, adminN: admin}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!grant.ok) {
                const j = await grant.json()
                console.log(j.message);
                setUE(j.message)
            } else{
                const j = await grant.json()
                console.log(j.message);
                setUE(j.message)

                nav('/')
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    const buttonClick = () => {

        setUE("")

        if (email === "") {
            setUE("Please enter your email address")
            return
        }

        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            setUE("Please enter a valid email")
        }


        granting(email)
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
                    <Link to='/'>Log out</Link>
            </div>

            <div className = "main">

                <div className = "title">
                    <h1>Grant Admin Access</h1>
                </div>

                <div className = "userInput">
                    <form className = "input">
                        <input value={email} className = "i" id = "user"autocomplete="off" placeholder=" Enter User Email..." onChange={userin => setE(userin.target.value)}/>
                    </form>
                    <label className="error">{userE}</label>
                </div>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick}>Enter</button>
                </div>

            </div>
        </div>
    )
}

export default Grant;