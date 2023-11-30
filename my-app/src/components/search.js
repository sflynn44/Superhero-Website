import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './search.css';

const Search = () => {
    const nav = useNavigate()

    let userN = localStorage.getItem("email")

    if(userN == "admin123@gmail.com"){
        userN = "Admin"
    }

    const [name, setN] = useState("")
    const [race, setR] = useState("")
    const [pub, setP] = useState("")
    const [power, setPO] = useState("")
    const [error, setE] = useState("")

    function displayResults(data){

        const d = document.getElementById("results")
        while(d.firstChild){
            d.removeChild(d.firstChild)
        }

        const outerList = document.createElement("ul");
        outerList.classList.add('outerList')
        
      
        data.forEach(e =>{
          const innerList = document.createElement("ul");
          innerList.classList.add('innerL')
      
          for(const key in e){
            if(key == "name" || key == "Publisher"){
            const item = document.createElement('li')
            item.appendChild(document.createTextNode(`${key}: ${e[key]}`))
            innerList.appendChild(item)
            }
          }
          outerList.appendChild(innerList)
        })
        d.appendChild(outerList)
      }


    async function searching(name, race, pub, power){

        try{
            const s = await fetch('/api/users/searchHeroes', {
        
                method: "POST",
                  
                body: JSON.stringify({nameR: name, raceR: race, publisherR: pub, powerR: power }),
                  
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!s.ok) {
                const j = await s.json()
                console.log(j.message);
                setE(j.message)                  

            } else{
                const j = await s.json()
                
                console.log(j)
                
                displayResults(j)
                
            }
        }catch(error){
            console.log(`Error message: ${error}`)
        }
    }

    const buttonClick = () => {
        searching(name, race, pub, power)
    }

    return (

        <div className = "base">
            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search' className = "selected">Search Heroes</Link>
                <Link>Public Lists</Link>
                <Link>Custom Lists</Link>
                <Link to='/updateP'>Account Settings</Link>
                <Link to='/login'>Login</Link>
                <h3>{userN}</h3>
            </div>

            <div className = "mains">

                <div className = "title">
                    <h1>Search for Heroes</h1>
                </div>

                <div className = "inputs">
                    <form className = "input">
                        <input value={name} className = "in" id = "user"autocomplete="off" placeholder=" Enter Name..." onChange={name => setN(name.target.value)}/>
                    </form>

                    <form className = "input">
                        <input value={race} className = "in" id = "user"autocomplete="off" placeholder=" Enter Race..." onChange={race => setR(race.target.value)}/>
                    </form>

                    <form className = "input">
                        <input value={pub} className = "in" id = "user"autocomplete="off" placeholder=" Enter Publisher..." onChange={pub => setP(pub.target.value)}/>
                    </form>

                    <form className = "input">
                        <input value={power} className = "in" id = "user"autocomplete="off" placeholder=" Enter Power..." onChange={power => setPO(power.target.value)}/>
                    </form>
                </div>

                <div className = "b">
                    <button className = "button" onClick = {buttonClick}>Search</button>
                    <label className="error">{error}</label>
                </div>

                <div id = "results"></div>

            </div>
        </div>
    )
}

export default Search;