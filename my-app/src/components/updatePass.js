import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './updatePass.css';

const UpdatePass = () => {
    const nav = useNavigate()

    let userN = localStorage.getItem("username")

    const [oldPass, setP] = useState("")
    const [newPass, setNP] = useState("")
    const [confirmPass, setCP] = useState("")
    const [passwordE1, setPE1] = useState("")
    const [passwordE2, setPE2] = useState("")
    const [passwordE3, setPE3] = useState("")


    async function updating(userN, oldPass, newPass, confirmPass){

        let token = localStorage.getItem("jwtToken");

        try{
            const update = await fetch('/api/auth/updatePassword', {
        
                method: "POST",
                  
                body: JSON.stringify({email: userN, oldPass: oldPass, newPass: newPass, confirmPass: confirmPass}),
                  
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!update.ok) {
                const j = await update.json()
                console.log(j.message);
                setPE3(j.message)
            } else{
                const j = await update.json()
                console.log(j.message);
                setPE3(j.message)

                nav('/accountS')
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }



    const buttonClick = () => {

        setPE1("")
        setPE2("")
        setPE3("")

        if(oldPass === ""){
            setPE1("Please enter your current password")
            return
        }

        if(newPass === ""){
            setPE2("Please enter your new password")
            return
        }

        if(confirmPass === ""){
            setPE3("Please confirm your new password")
            return
        }

        if(newPass != confirmPass){
            setPE3("Please enter the same password")
            return
        }

        updating(userN, oldPass, newPass, confirmPass)
            
    }

    return(

        <div className = "base">

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
                    <h1>Update Password</h1>
                </div>

                <div className = "passInput">
                    <form className = "input">
                        <input value={oldPass} className = "i" id = "user"autocomplete="off" placeholder=" Enter Current Password..." onChange={oldP => setP(oldP.target.value)}/>
                    </form>
                    <label className="error">{passwordE1}</label>
                </div>

                <div className = "passInput">
                    <form className = "input">
                        <input value={newPass} className = "i" id = "user"autocomplete="off" placeholder=" Enter New Password..." onChange={newP => setNP(newP.target.value)}/>
                    </form>
                    <label className="error">{passwordE2}</label>
                </div>

                <div className = "passInput">
                    <form className = "input">
                        <input value={confirmPass} className = "i" id = "user"autocomplete="off" placeholder=" Confirm New Password..." onChange={confirmP => setCP(confirmP.target.value)}/>
                    </form>
                    <label className="error">{passwordE3}</label>
                </div>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick}>Change Password</button>
                </div>

            </div>

        </div>

    )
}

export default UpdatePass