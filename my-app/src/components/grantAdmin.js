import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './grantAdmin.css';


const Grant = () => {
    const nav = useNavigate()

    let userN = localStorage.getItem("username")

    const [email, setE] = useState("")
    const [userE, setUE] = useState("")

    async function granting(email){

        let admin = localStorage.getItem("email")
        let token = localStorage.getItem("jwtToken");

        try{
            const grant = await fetch('/api/auth/grantAdmin', {
        
                method: "POST",
                  
                body: JSON.stringify({email: email, adminN: admin}),
                  
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`
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

    async function deactivating(email, type){

        let admin = localStorage.getItem("email")
        console.log(admin)

        try{
            const grant = await fetch('/api/users/deactivate', {
        
                method: "POST",
                  
                body: JSON.stringify({email: email, adminN: admin, type: type}),
                  
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

                nav('/accountS')
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
            return
        }

        let selectedType = document.getElementById("dropdown").value

        if(selectedType.trim() === ""){
          setUE("Select Action Type")
          return
        }

        if(selectedType == "grant"){
            granting(email)
        }else if(selectedType == "DE"){
            deactivating(email, "deactiveate")
        }else if(selectedType == "A"){
            deactivating(email, "active")
        }
    }

    return (

        <div className = "base">
            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search'>Search Heroes</Link>
                <Link>Public Lists</Link>
                <Link to= '/customL'>Custom Lists</Link>
                <Link to='/accountS'>Account Settings</Link>
                <Link to='/login'>Login</Link>
                <h3>{userN}</h3>
            </div>

            <div className = "main">

                <div className = "title">
                    <h1>Alter User Accounts</h1>
                </div>

                <div className = "userInput">
                    <form className = "input">
                        <input value={email} className = "i" id = "user"autocomplete="off" placeholder=" Enter User Email..." onChange={userin => setE(userin.target.value)}/>
                    </form>
                    <label className="error">{userE}</label>
                </div>

                <select class="drops" id ="dropdown">
                    <option id ="selectedText" value=""disabled selected>Actions</option>
                    <option value="grant">Grant Admin</option>
                    <option value="DE">Deactivate User</option>
                    <option value="A">Activate User</option>
                </select>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick}>Enter</button>
                </div>

            </div>
        </div>
    )
}

export default Grant;