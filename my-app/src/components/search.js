import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Link} from 'react-router-dom';
import './search.css';

const Search = () => {
    const nav = useNavigate()

    let userN = localStorage.getItem("username")

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
          const powerButton = document.createElement("button");
          const buttonText = document.createTextNode("Powers");
          powerButton.appendChild(buttonText);
          powerButton.classList.add('powerButton')

          const infoButton = document.createElement("button");
          const buttonTexts = document.createTextNode("Info");
          infoButton.appendChild(buttonTexts);
          infoButton.classList.add('powerButton')

          const searchButton = document.createElement("button");
          const buttonsTexts = document.createTextNode("Search DDG");
          searchButton.appendChild(buttonsTexts);
          searchButton.classList.add('powerButton')

          powerButton.addEventListener('click', async function () {

            const heroName = e["name"];
               
                try{
                    const s = await fetch(`/api/heroes/${heroName}`)
        
                    if (!s.ok) {
                        const j = await s.json()
                        console.log(j.message);
                        setE(j.message)                  
        
                    } else{
                        const j = await s.json()
                        console.log(j)
                        const parentList = powerButton.parentElement; 

                        j.forEach(obj => {
                            for(const key in obj){
                                const items = document.createElement('li')
                                items.appendChild(document.createTextNode(obj[key].join(', ')))

                                const closeButton = document.createElement("button");
                                const buttonText = document.createTextNode("Close");
                                closeButton.appendChild(buttonText);
                                closeButton.classList.add('powerButton')

                                closeButton.addEventListener('click', function () {

                                    parentList.removeChild(items)
                                    
                                });
                                
                                items.appendChild(closeButton);
                                parentList.append(items);
                            }
                        })
                                                                      
                    }
                }catch(error){
                    console.log(`Error message: ${error}`)
                }

          })


          infoButton.addEventListener('click', async function () {
            const heroName = e["name"];
        
            try {
                const s = await fetch(`/api/heroes/${heroName}/information`)
        
                if (!s.ok) {
                    const j = await s.json()
                    console.log(j.message);
                    setE(j.message)
        
                } else {
                    const j = await s.json()
                    console.log(j)
                    const parentList = infoButton.parentElement;
        
                    const items = document.createElement('li');

                    j.forEach(obj => {
                        for (const key in obj) {
                            items.appendChild(document.createTextNode(`${key}: ${e[key]}\n`));
                            items.appendChild(document.createElement('br'));
                        }
                    });

                    parentList.append(items);
        
                    const closeButton = document.createElement("button");
                    const buttonText = document.createTextNode("Close");
                    closeButton.appendChild(buttonText);
                    closeButton.classList.add('powerButton');
        
                    closeButton.addEventListener('click', function () {
                        parentList.removeChild(items);
                        parentList.removeChild(closeButton)
                    });
        
                    parentList.append(closeButton);
                }
            } catch (error) {
                console.log(`Error message: ${error}`)
            }
        });
            

        searchButton.addEventListener('click', async function () {
            const heroName = e["name"];
            const publisher = e["Publisher"]

            const search = encodeURIComponent(heroName+" "+publisher)
        
            try {
                
                window.open(`https://duckduckgo.com/${search}`, "_blank")
                
            } catch (error) {
                console.log(`Error message: ${error}`)
            }
        });


          innerList.appendChild(powerButton)
          innerList.appendChild(infoButton)
          innerList.appendChild(searchButton)
    
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
        setE("")                  

        searching(name, race, pub, power)
    }

    return (

        <div className = "base">
            <div className ="sidebar">
                <h2>Site Operations</h2>
                <Link to='/search' className = "selected">Search Heroes</Link>
                <Link to='/publicL'>Public Lists</Link>
                <Link to= '/customL'>Custom Lists</Link>
                <Link to='/accountS'>Account Settings</Link>
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