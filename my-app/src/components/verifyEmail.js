import React, {useState}from "react"
import {useNavigate} from "react-router-dom"
import { useParams } from 'react-router-dom';


const Verify = () => {
    const nav = useNavigate()

    const { email } = useParams();

    async function verifing(email){
        try{
            const ver = await fetch(`/api/users/emailConfirmation/${email}`, {
        
                method: "POST",
                
                body: JSON.stringify({email: email}),
                
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!ver.ok) {
                const j = await ver.json()
                console.log("Response:", j.message);
                
            }else{
                const j = await ver.json()
                console.log("Response:", j.message);

                nav('/login')
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    const buttonClick = () => {
        verifing(email)
    }

    return(

        <div className = "b">
            <button className = "button" onClick = {buttonClick}>Verify</button>
        </div>
    )
}

export default Verify
