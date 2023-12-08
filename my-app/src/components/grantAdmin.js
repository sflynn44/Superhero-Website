import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './grantAdmin.css';
import { removeTags } from './sanitization';


const Grant = () => {
    const nav = useNavigate()

    //get username to display
    let userN = localStorage.getItem("username")

    //create variables 
    const [email, setE] = useState("")
    const [userE, setUE] = useState("")

    //function to grant admin 
    async function granting(email){

        //get email and token to verify 
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
            //if error response print it 
            if (!grant.ok) {
                const j = await grant.json()
                console.log(j.message);
                setUE(j.message)
            //if successful print it and go to home page 
            } else{
                const j = await grant.json()
                console.log(j.message);
                setUE(j.message)

                nav('/')
            }
        //else if successful print it 
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    //function to adjust the status of a user 
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
            //if error response print it
            if (!grant.ok) {
                const j = await grant.json()
                console.log(j.message);
                setUE(j.message)
            //if successful print it and go to home page 
            } else{
                const j = await grant.json()
                console.log(j.message);
                setUE(j.message)

                nav('/accountS')
            }
        //else if successful print it 
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    const buttonClick = () => {

        setUE("")

        //ensure email is input and is valid format 
        if (email === "") {
            setUE("Please enter an email address")
            return
        }

        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            setUE("Please enter a valid email")
            return
        }

        //sanitization 
        setE(removeTags(email))

        //get the type selected 
        let selectedType = document.getElementById("dropdown").value

        if(selectedType.trim() === ""){
          setUE("Select Action Type")
          return
        }

        //based on the selected action call the funtion 
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
                <Link to='/publicL'>Public Lists</Link>
                <Link to= '/customL'>Custom Lists</Link>
                <Link to='/accountS' className = "selected">Account Settings</Link>
                <Link to='/login'>Login</Link>
                <Link to ='/pol'>Policies</Link>
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