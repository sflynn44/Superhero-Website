import React, {useState} from "react"
import { useEffect } from "react";
import {Link} from 'react-router-dom';
import './publicList.css';

const Public = () => {

    let userN = localStorage.getItem("username")

    const [listsNames, setDO] = useState([]);
    const [listData, setData] = useState()
    const [title, setT] = useState();
    const [error, setE] = useState("")
    const [heroInfo, setHI] = useState();
    const [requiredInfo, setRI] = useState();

    useEffect(() => {
        populateList();
    }, []);

    function selectedTitle(event){
        const title = event.target.value;
        console.log(title)
        setT(title)
        newPublicListInfo(title)
    }


    async function populateList(){

        try{
            const populate = await fetch('/api/heroes/lists/public', {
        
                method: "POST",
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!populate.ok) {
                const j = await populate.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await populate.json();
                console.log(j)

                const listsDate = j.files.map((list) => ({...list,
                    modsDate: new Date(list.modsDate),
                }));

                const sortedList = listsDate.sort(
                    (a, b) => b.modsDate - a.modsDate
                );

                const recent10Lists = sortedList.slice(0, 10);

                setDO(recent10Lists);             
                
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    async function showList(title){

        try{
            const info = await fetch('/api/heroes/getListInfo', {
        
                method: "POST",
                  
                body: JSON.stringify({title: title}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!info.ok) {
                const j = await info.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await info.json()
                console.log(j)
                setData(j)

            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    async function listInfo(selectTitle){

        try{
            const info = await fetch(`/api/heroes/getInfo/${selectTitle}`
            )
            if (!info.ok) {
                const j = await info.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await info.json()
                console.log(j)
                setHI(j)
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    async function newPublicListInfo(title){

        try{
            const info = await fetch(`/api/heroes/getPublicInfo`, {
        
                method: "POST",
                  
                body: JSON.stringify({title: title}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!info.ok) {
                const j = await info.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await info.json()
                console.log(j)
                setRI(j)
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }



    const buttonClick4= () => {
        setHI()

    }

    const buttonClick3= () => {
        setE("")

        listInfo(title)

    }

    const buttonClick2= () => {
        setE("")

        showList(title)

    }

    const buttonClick1= () => {
        setData()

    }

    return (

        <div className = "base">

            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search'>Search Heroes</Link>
                <Link to='/publicL' className = "selected">Public Lists</Link>
                <Link to= '/customL'>Custom Lists</Link>
                <Link to='/accountS'>Account Settings</Link>
                <Link to='/login'>Login</Link>
                <h3>{userN}</h3>
            </div>

            <div className = "main">

                <div className = "title">
                    <h1>Public lists</h1>
                </div>

                <h4>Public Lists</h4>

                {listsNames != null && listsNames.map((list, index) => (
                    <button className="powerButton" key={index} onClick={() => selectedTitle({ target: { value: list.name } })}>
                        {list.name}
                    </button>
                ))}


                <ul className="innerL">
                    {requiredInfo != null && (
                        <li>
                            <strong>Title:</strong> {requiredInfo[0]}<br />
                            <strong>Username:</strong> {requiredInfo[1]}<br />
                            <strong>Number of Heroes:</strong> {requiredInfo[2]}<br />
                            <strong>Average Rating:</strong> {requiredInfo[3]}<br />
                        </li>
                    )}
                    <button className = "powerButton" onClick = {buttonClick3}>Hero Info</button>
                    <button className = "powerButton" onClick = {buttonClick2}>List Info</button>
                    <label className="error">{error}</label>
                </ul>

                <ul className="innerL">
                    <h4>List information</h4>
                    {listData != null && listData.map((item) => (
                        <li key={Object.keys(item)}>
                            <strong>{Object.keys(item)}:</strong> {JSON.stringify(Object.values(item)[0])}
                        </li>
                    ))}
                    <button className = "powerButton" onClick = {buttonClick1}>Close</button>
                    <label className="error">{error}</label>
                </ul>


                <ul className="innerL">
                    <h4>Hero information</h4>
                    {heroInfo != null && heroInfo.map((hero, index) => (
                        <li key={index}>
                        {hero.name && (
                            <div>
                                <strong>ID:</strong> {hero.id} <br/>
                                <strong>Name:</strong> {hero.name} <br/>
                                <strong>Gender:</strong> {hero.Gender} <br/>
                                <strong>Eye color:</strong> {hero['Eye color']} <br/>
                                <strong>Race:</strong> {hero.Race} <br/>
                                <strong>Hair Colour:</strong> {hero['Hair colour']} <br/>
                                <strong>Height:</strong> {hero.Height} <br/>
                                <strong>Publisher:</strong> {hero.Publisher} <br/>
                                <strong>Skin Colour:</strong> {hero['Skin colour']} <br/>
                                <strong>Alignment:</strong> {hero.Alignment} <br/>
                                <strong>Weight:</strong> {hero.Weight} <br/>
                            </div>
                        )}
                        {hero.Abilities && (
                            <div>
                                <strong>Abilities:</strong> {JSON.stringify(hero.Abilities)} <br />
                            </div>
                        )}
                        <br></br>
                        </li>
                    ))}
                    <button className="powerButton"onClick = {buttonClick4}>Close</button>
                    <label className="error">{error}</label>
                </ul>         
            </div>
        </div>
    )
}   

export default Public