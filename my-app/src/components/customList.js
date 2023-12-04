import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './customList.css';

const Custom = () => {
    const nav = useNavigate()

    let userN = localStorage.getItem("email")

    const [selectAction, setSA] = useState(null);
    const [name, setN] = useState("")
    const [description, setD] = useState("")
    const [ids, setI] = useState("")
    const [error, setE] = useState("")
    const [listsNames, setDO] = useState([]);

    if(userN == "admin123@gmail.com"){
        userN = "Admin"
    }

    function selected(event){
        setSA(event.target.value);
        populateList(userN)
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
  
        console.log(ids)
        createList(ids)
        adjustList(name,"True")
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

                <div className = "">

                    <h2>Custom List Actions</h2>

                    <select className="drop" id="dropdown" value={selectAction} onChange={selected}>
                        <option id ="selectedText" value=""disabled selected>Actions</option>
                        <option value="create">Create List</option>
                        <option value="show">Show Lists</option>
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

            </div>   
        </div>    

    )
}

export default Custom