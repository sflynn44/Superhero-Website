import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './homePage.css';

const Home = () => {
    const nav = useNavigate()

    //get username to display
    let userN = localStorage.getItem("username")

    return (

        <div className = "base">

            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search'>Search Heroes</Link>
                <Link to='/publicL'>Public Lists</Link>
                <Link to='/customL'>Custom Lists</Link>
                <Link to='/accounts'>Account Settings</Link>
                <Link to='/login'>Login</Link>
                <Link to ='/pol'>Policies</Link>
                <h3>{userN}</h3>
            </div>

            <div className = "content">
                <h1>Welcome to SE3316 Superheroes</h1>
                <p>If you have an interest in superheroes this site is for you.</p>
                <p>Here you can explore, save, and view superhero content</p>
            </div>


        </div>
    )

}

export default Home