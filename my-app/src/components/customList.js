import React, {useState} from "react"
import {Link} from 'react-router-dom';
import './customList.css';

const Custom = () => {

    let userN = localStorage.getItem("email")

    const [selectAction, setSA] = useState(null);
    const [name, setN] = useState("")
    const [description, setD] = useState("")
    const [ids, setI] = useState("")
    const [visibility, setV] = useState("")
    const [error, setE] = useState("")
    const [listsNames, setDO] = useState([]);
    const [title, setT] = useState("")
    const [listData, setData] = useState([]);
    const [replace, setRE] = useState("");

    if(userN == "admin123@gmail.com"){
        userN = "Admin"
    }

    function selected(event){
        setSA(event.target.value);
        setT("")
        populateList(userN)
    }

    function selectedTitle(event){
        const selectTitle = event.target.value;
        setT(selectTitle);
        showList(selectTitle);
    }

    function selectedReplace(event){
        const selectR = event.target.value;
        setRE(selectR)
    }

    function selectedVisibility(event){
        const vis = event.target.value;
        setV(vis)
    }

    async function populateList(){

        try{
            const populate = await fetch('/api/heroes/lists/j', {
        
                method: "POST",
                  
                body: JSON.stringify({email: userN}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!populate.ok) {
                const j = await populate.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await populate.json()

                setDO([]);

                const files = j.files
                files.forEach(item => {
                    adjustList(item, "True")
                });                  
                
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }


    async function createList(ids){

        try{
            const create = await fetch('/api/heroes/createList', {
        
                method: "POST",
                  
                body: JSON.stringify({ owner: userN, newName: name, des: description, IDs: ids }),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!create.ok) {
                const j = await create.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await create.json()
                console.log(j.message);
                setE(j.message)
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    function adjustList(title, operation){
        if (operation === 'True') {
            setDO(lists => [...lists, { text: title, value: title }]);
        }else if(operation === 'False'){
            setDO(lists => lists.filter(option => option.text !== title));
        }
    }


    async function showList(selectTitle){

        try{
            const info = await fetch('/api/heroes/getListInfo', {
        
                method: "POST",
                  
                body: JSON.stringify({title: selectTitle}),
                  
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


    async function addHero(selectTitle, replacing, idArrays){

        try{
            const add = await fetch('/api/heroes/addHero', {
        
                method: "PUT",
                  
                body: JSON.stringify({title: selectTitle, IDs: idArrays, replace: replacing}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!add.ok) {
                const j = await add.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await add.json()
                console.log(j.message)
                setE(j.message)
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }



    async function deleteList(selectTitle){

        try{
            const del = await fetch('/api/heroes/deleteList', {
        
                method: "DELETE",
                  
                body: JSON.stringify({title: selectTitle}),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!del.ok) {
                const j = await del.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await del.json()
                console.log(j.message)
                setE(j.message)
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }



    async function editList(selectTitle){

        try{
            const edit = await fetch('/api/heroes/editLists', {
        
                method: "PUT",
                  
                body: JSON.stringify({title: selectTitle, name: name, des: description, visibility: visibility }),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!edit.ok) {
                const j = await edit.json()
                console.log(j.message);
                setE(j.message)
            } else{
                const j = await edit.json()
                console.log(j.message)
                setE(j.message)
                
                adjustList(name, "True")

                setT("")
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }



    const buttonClick5= () => {
        setE("")

        editList(title)
        adjustList(title, "False")

        setN("")
        setV("")
        setD("")

    }

    const buttonClick4 = () => {
        const b = document.querySelector('.b');
        const text = document.querySelector('.confirmText');
        const yesButton = document.querySelector('.yesButton');
        const noButton = document.querySelector('.noButton');
        b.removeChild(text)
        b.removeChild(yesButton)
        b.removeChild(noButton)
    }

    const buttonClick3 = () => {
        setE("")

        deleteList(title)
        adjustList(title,"False")

    }

    const buttonClick2 = () => {
        setE("")

        const b = document.querySelector('.b');
        const text = document.createElement("h2")
        text.classList.add('confirmText')
        const textText = document.createTextNode("Confirm?");
        text.appendChild(textText)
        b.appendChild(text)

        const yesButton = document.createElement("button");
        const buttonT = document.createTextNode("Yes");
        yesButton.appendChild(buttonT);
        yesButton.classList.add('powerButton', 'yesButton')

        const noButton = document.createElement("button");
        const buttonText = document.createTextNode("No");
        noButton.appendChild(buttonText);
        noButton.classList.add('powerButton', 'noButton')

        b.appendChild(yesButton)
        b.appendChild(noButton)

        yesButton.addEventListener('click', buttonClick3);
        noButton.addEventListener('click', buttonClick4);
    }


    const buttonClick1 = () => {
        setE("")

        const idArrays = ids.split(" ")
        let validity = "True"
        idArrays.forEach((id) => {
            const numericID = parseInt(id)

            if(numericID > 733){
                setE("ID input can not be greater than 733")
                validity = "False"
                return
            }
        })

        if(validity == "True"){
            addHero(title, replace, idArrays)
        }

        setI("")
        setRE("")
    }


    const buttonClick = () => {
        setE("")                  

        if (name === "") {
            setE("Please enter a list name")
            return
        }

        if (ids === "") {
            setE("Please enter hero IDs.")
            return
        }

        const listNamesCheck = listsNames.some(item => item.text === name)
        if(listNamesCheck){
            setE("Error list name already exists")
            return
        }

        //split list of ids if more than 1 is given 
        const idArray = ids.split(" ")
        let validity = "True"
        idArray.forEach((id) => {
            const numericID = parseInt(id)

            if(numericID > 733){
                setE("ID input can not be greater than 733")
                validity = "False"
                return
            }
        })
  
        if(validity == "True"){
            createList(idArray)
            adjustList(name,"True")
        }   

        setN("")
        setD("")
        setI("")
    }

    return (

        <div className = "base">

            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search'>Search Heroes</Link>
                <Link>Public Lists</Link>
                <Link to= '/customL'>Custom Lists</Link>
                <Link to='/accounts'>Account Settings</Link>
                <Link to='/login'>Login</Link>
                <h3>{userN}</h3>
            </div>

            <div className = "mains">

                <div className = "test">

                    <h2>Custom List Actions</h2>

                    <select className="drop" id="dropdown" value={selectAction} onChange={selected}>
                        <option id ="selectedText" value=""disabled selected>Actions</option>
                        <option value="create">Create List</option>
                        <option value="show">Show Lists</option>
                        <option value="edit">Edit Lists</option>
                        <option value="review">Review a List</option>
                    </select>
                </div>

                {selectAction ==='create' && (
                    <div className="selectedAction">
                        <h4>Create a New List</h4>

                        <div className = "inputs">
                            <form className = "input">
                                <input value={name} className = "in" id = "user"autocomplete="off" placeholder=" Enter Name..." onChange={name => setN(name.target.value)}/>
                            </form>

                            <form className = "input">
                                <input value={description} className = "in" id = "user"autocomplete="off" placeholder=" Enter Description (optional)..." onChange={description => setD(description.target.value)}/>
                            </form>

                            <form className = "input">
                                <input value={ids} className = "in" id = "user"autocomplete="off" placeholder=" Enter Hero IDs..." onChange={ids => setI(ids.target.value)}/>
                            </form>
                        </div>

                        <div className = "b">
                            <button className = "button" onClick = {buttonClick}>Create</button>
                        </div>
                        <label className="error">{error}</label>

                        <h4>CurrentLists</h4>

                        <select className="drop" id="dropdown">
                            <option id ="selectedText" value=""disabled selected>List Names</option>
                            {listsNames.map(list => (
                                <option key={list.value} value={list.value}>{list.text}</option>
                            ))}
                        </select>

                    </div>
                )}



                {selectAction ==='show' && (
                    <div className="selectedAction">
                        <h4>Select Current List</h4>

                        <select className="drop" id="dropdown" value={title} onChange={selectedTitle}>
                            <option id ="selectedText" value=""disabled selected>List Names</option>
                            {listsNames.map(list => (
                                <option key={list.value} value={list.value}>{list.text}</option>
                            ))}
                        </select>

                        {listData && (
                            <div>
                                <h4>List information</h4>

                                <ul className="innerL">
                                    {listData.map((item) => (
                                        <li key={Object.keys(item)[0]}>
                                        <strong>{Object.keys(item)[0]}:</strong> {JSON.stringify(Object.values(item)[0][0])}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}


                {selectAction ==='edit' && (
                    <div className="selectedAction">
                        <h4>Select a List</h4>

                        <select className="drop" id="dropdown" value={title} onChange={selectedTitle}>
                            <option id ="selectedText" value=""disabled selected>List Names</option>
                            {listsNames.map(list => (
                                <option key={list.value} value={list.value}>{list.text}</option>
                            ))}
                        </select>

                        <h4>Input Edits</h4>

                        <div className = "inputs">
                            <form className = "input">
                                <input value={name} className = "in" id = "user"autocomplete="off" placeholder=" Edit Name..." onChange={name => setN(name.target.value)}/>
                            </form>

                            <form className = "input">
                                <input value={description} className = "in" id = "user"autocomplete="off" placeholder=" Edit Description (optional)..." onChange={description => setD(description.target.value)}/>
                            </form>

                            <form className = "input">
                                <input value={ids} className = "in" id = "user"autocomplete="off" placeholder=" Edit Hero IDs..." onChange={ids => setI(ids.target.value)}/>
                            </form>
                        </div>

                        <select className="drop" id="dropdown" value={visibility} onChange={selectedVisibility}>
                            <option id ="selectedText" value=""disabled selected>Visibility</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>

                        <select class="drop" id ="dropdown3" value={replace} onChange={selectedReplace}>
                            <option id ="selectedText" value=""disabled selected>Delete Hero ID</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="clear">Clear all</option>
                        </select>

                        <div className = "b">
                            <button className = "button" onClick = {buttonClick5}>Edit Info</button>
                            <button className = "button" onClick = {buttonClick1}>Edit Heroes</button>
                            <br></br>
                            <button className = "powerButton" onClick = {buttonClick2}>Delete</button>
                            <br></br>
                        </div>
                        <label className="error">{error}</label>
                    </div>

                )}
            </div>   
        </div>    

    )
}

export default Custom