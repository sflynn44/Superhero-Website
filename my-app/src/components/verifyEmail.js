import React, {useState}from "react"
import {useNavigate} from "react-router-dom"
import { useParams } from 'react-router-dom';


const Verify = () => {
    const nav = useNavigate()

    //get the email 
    const { email } = useParams();

    //function to verify email 
    async function verifing(email){
        try{
            const ver = await fetch(`/api/users/emailConfirmation/${email}`, {
        
                method: "POST",
                
                body: JSON.stringify({email: email}),
                
                headers: {
                    "Content-type": "application/json"
                }
            })
            //if error returned print it 
            if (!ver.ok) {
                const j = await ver.json()
                console.log("Response:", j.message);
            //if successful print it 
            }else{
                const j = await ver.json()
                console.log("Response:", j.message);

                nav('/login')
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    //call verify function
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
