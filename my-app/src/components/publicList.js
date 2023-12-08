import React, {useState} from "react"
import { useEffect } from "react";
import {Link} from 'react-router-dom';
import './publicList.css';

const Public = () => {

    //get the username to display 
    let userN = localStorage.getItem("username")

    //create the values 
    const [listsNames, setDO] = useState([]);
    const [listData, setData] = useState()
    const [title, setT] = useState();
    const [error, setE] = useState("")
    const [heroInfo, setHI] = useState();
    const [requiredInfo, setRI] = useState();

    //populate the list when the page is entered
    useEffect(() => {
        populateList();
    }, []);

    function selectedTitle(event){
        const title = event.target.value;
        console.log(title)
        setT(title)
        newPublicListInfo(title)
    }

    //populate the list with public lists 
    async function populateList(){

        try{
            const populate = await fetch('/api/heroes/lists/public', {
        
                method: "POST",
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            //if error returned print it 
            if (!populate.ok) {
                const j = await populate.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await populate.json();
                console.log(j)

                //adjust lists based on modification date 
                const listsDate = j.files.map((list) => ({...list,
                    modsDate: new Date(list.modsDate),
                }));

                //sort the lists 
                const sortedList = listsDate.sort(
                    (a, b) => b.modsDate - a.modsDate
                );

                //only get the most recent 10
                const recent10Lists = sortedList.slice(0, 10);

                //set the values 
                setDO(recent10Lists);             
                
            }
        //if error with fetch print it 
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    //function to show list information
    async function showList(title){

        try{
            const info = await fetch('/api/heroes/getListInfo', {
        
                method: "POST",
                  
                body: JSON.stringify({title: title}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            //if error returned print it 
            if (!info.ok) {
                const j = await info.json()
                console.log(j.message);
                setE(j.message)
            //set the data if successful
            } else{
                const j = await info.json()
                console.log(j)
                setData(j)

            }
        //if error with fetch print it 
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    async function listInfo(selectTitle){

        try{
            const info = await fetch(`/api/heroes/getInfo/${selectTitle}`
            )
            //if error returned print it 
            if (!info.ok) {
                const j = await info.json()
                console.log(j.message);
                setE(j.message)
            //set the data if successful
            } else{
                const j = await info.json()
                console.log(j)
                setHI(j)
            }
        //if error with fetch print it 
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    //get the info that should show for the public lists 
    async function newPublicListInfo(title){

        try{
            const info = await fetch(`/api/heroes/getPublicInfo`, {
        
                method: "POST",
                  
                body: JSON.stringify({title: title}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            //if error returned print it 
            if (!info.ok) {
                const j = await info.json()
                console.log(j.message);
                setE(j.message)
            //set the data if successful
            } else{
                const j = await info.json()
                console.log(j)
                setRI(j)
            }
        //if error with fetch print it 
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    //reset data 
    const buttonClick4= () => {
        setHI()
    }

    //get list info for heroes in list 
    const buttonClick3= () => {
        setE("")

        listInfo(title)
    }

    //get list info
    const buttonClick2= () => {
        setE("")

        showList(title)
    }

    //reset data 
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