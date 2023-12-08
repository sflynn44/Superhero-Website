import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './policies.css';

const Policies = () => {

    //create the variables 
    const [Sfiles, setSFiles] = useState(true);
    const [Afiles, setAFiles] = useState(true);

    //get username to display
    let userN = localStorage.getItem("username")

    //if clicked display the security policy
    function buttonClick(fileUrl) {
        if (Sfiles) {
            window.open(fileUrl, "_blank");
        }
    }

    //if clicked display the aup 
    function buttonClick1(fileUrl){
        if (Afiles) {
            window.open(fileUrl, "_blank");
        }
    }

    return (

        <div className = "base">
            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search'>Search Heroes</Link>
                <Link to='/publicL'>Public Lists</Link>
                <Link to= '/customL'>Custom Lists</Link>
                <Link to='/accountS'>Account Settings</Link>
                <Link to='/login'>Login</Link>
                <Link to ='/pol' className = "selected">Policies</Link>
                <h3>{userN}</h3>
            </div>

            <div className = "main">

                <div className = "title">
                    <h1>Policies</h1>
                </div>

                <div className = "b">
                    <button className = "button" onClick={() => buttonClick('/privacyPolicy.html')}>Security</button>
                </div>

                <div className = "b">
                    <button className = "button" onClick={() => buttonClick1('/aup.html')}>AUP</button>
                </div>
            </div>
        </div>
    )

} 

export default Policies