//getting the required assets
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const bcrypt = require('bcrypt')
const router = express.Router()
const router2 = express.Router()
const router3 = express.Router()
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require("jsonwebtoken");
require('dotenv').config();

app.use('/', express.static('my-app'));

const verify = (req, res, next) => {

  let token = req.headers.authorization 
  console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  token = token.split(' ')[1];
  console.log(token)

  jwt.verify(token, process.env.JWT_SECRET, (error, userData) => {

    if(error){
      return res.status(401).json({ message: 'Issue with verification'});
    }else{
      req.user = userData
      next()
    }
  })
}

router3.use(verify)


//middleware to do logging 
app.use((req, res, next) => {
  //message for all routes
  console.log(`${req.method} request for ${req.url}`)
  console.log('Headers:', req.headers);
  next()
})

//ensure json data is acceptable 
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


let data = [];
//read the json hero info data and parse it into the array
fs.readFile('Server/superhero_info.json', 'utf8', (e, jsonData) => {

    if (e) {
      //message if the file is not read
      console.log('Error with reading the JSON file:', e);
    } else {
      //adding the data to the variable 
      data = JSON.parse(jsonData);
    }
  });


let power = []
//read the json hero power data and parse it into the array
fs.readFile('Server/superhero_powers.json', 'utf8', (e, jsonPower) => {

    if (e) {
      //message if the file is not read 
      console.log('Error with reading the JSON file:', e);
    } else {
      //adding the data to the variable 
      power = JSON.parse(jsonPower);
    }
});


// Get all the heroes information
router.get('/', (req, res) => {
    res.json(data);
  });

  

// Get a heroes powers by their ID
router.get('/:name', (req, res) => {

    const customList = []
    //read the id into int and search for the hero that matches it
    const heroName = req.params.name
    const hero = data.find(hero => hero.name === heroName);

    //if the hero is found return it and if not state the error
    if (hero) {

      //get the powers for the associated hero name 
      const powers = power.find(p => p.hero_names === hero.name);

      //if the powers exist run it if not add none message
      if (powers) {

        //search through all the powers and return only the name of the ones set to true 
        const trueAbilities = Object.entries(powers).filter(([ability, hasAbility]) => hasAbility === 'True').map(([ability]) => ability);

        //if there are powers set to true push them to the list if not add none message
        if (trueAbilities.length > 0) {
          customList.push(({ Abilities: trueAbilities }));
        } else {
          //push this to ensure loop continues and show that no abilities exists
          customList.push(({ Abilities: "No abilities" })); 
        }
      } else {
        //push this to ensure loop continues since some heroes do not have powers section
        customList.push(({ Abilities: "No abilities" }));
      }
    } else {
      res.status(404).json({ message: 'Hero not found' });
    }

  //send the list of powers for the hero 
  res.json(customList)
});


//Get a heroes information from their ID
router.get('/:name/information', (req, res) => {
  //read the id into int and search for the hero that matches it
  const heroName = req.params.name;
  const hero = data.find(hero => hero.name === heroName);

  const array = []

  //if the hero information is found send it if not alert that it is not found 
  if(hero){
    //add hero to array 
    array.push(hero)
    res.json(array)
  } else {
    res.status(404).json({ message: 'Hero not found' });
  }
  
});











//Search function based on the user input 
router2.post('/searchHeroes', (req, res) => {

  //get the search inputs 
  const nameR = req.body.nameR.toLowerCase()
  const raceR = req.body.raceR.toLowerCase()
  const pubR = req.body.publisherR.toLowerCase()
  const powerR = req.body.powerR

  //alter the power to not be case sensitive 
  const firstLetPower = powerR.charAt(0)
  const upperFLP = firstLetPower.toUpperCase()
  const remainingP = powerR.slice(1)
  const newPowerR = upperFLP + remainingP

  //copy all of the data
  let results = data

  //if there is input in the name category filter the heroes for the name 
  if(nameR !== ""){
    results = results.filter(hero => hero.name.toLowerCase().includes(nameR))
  }

  //if there is input in the race category filter the heroes for the race 
  if (raceR !== ""){
    results = results.filter(hero => hero.Race.toLowerCase().includes(raceR))
  }

  //if there is input in the publisher category filter the heroes for the publisher 
  if (pubR !== ""){
    results = results.filter(hero => hero.Publisher.toLowerCase().includes(pubR))
  }

  //if there is input in the power category filter the heroes for the power 
  if (newPowerR !== ""){

    //if all the other search fields are empty search for powers from power array
    if(nameR == "" && raceR == "" && pubR == ""){
      
      //get all the power objects where the input power is true 
      const pResults = power.filter(p => p[newPowerR] === "True");

      //if the power objects exist
      if(pResults.length > 0){
        //get the hero names of the true powers 
        const hResults = pResults.map(r => r.hero_names)
       
        //if the hero names exist 
        if(hResults.length > 0){

          //create the temp list 
          powerResult = []

            for(let p=0; p<hResults.length; p++){
              //get the hero information for the heroes with true power
              powerResult.push(results.filter(hero => hero.name.includes(hResults[p])))
            }
            
            //set results equal to that list of heros 
            results = powerResult
        }
      }

      //if the other fields have input filter the results from the other 
    } else {
      
      //get the names from the filtered results 
      const names = results.map(r => r.name)

      //create the temp array
      pow = []

      for(let i=0; i<names.length; i++){

        //search the power data for the object with the hero names
        const powers = power.find(p => p.hero_names === names[i]);

        //if it exists and the designated power is equal to true 
        if (powers && powers[newPowerR] === "True") {

              //push the hero names that have that power equal to true
              pow.push(names[i]);
        }

        //create the temp array
        powerResults = []
        for(let j=0; j<pow.length; j++){
          //add the hero information for the heroes 
          powerResults.push(data.filter(hero => hero.name===(pow[j])))

        }
        //set results equal to the power filter results 
        results = powerResults[0] 
      }
    }
  }

  //if results are found send them 
  if(results.length>0){
    res.json(results);
  } else {
    //if not send an error message 
    res.status(404).json({ message: 'Results not found' });
  }

})


//create a custom list 
router.post('/createList', (req, res) => {

  //get the name, owner, and description for the new list 
  const newName = req.body.newName.toLowerCase(); 
  const owner = req.body.owner; 
  const description = req.body.des; 
  const IDs = req.body.IDs; 


  //if either required fields are empty send an error message 
  if (newName === "" || owner === "") {
    return res.status(400).json({ message: "Missing list elements" });
  }

  //if the list already exists send error code 
  if(fs.existsSync(`Lists/${newName}.json`)){
    return res.status(400).json({message: "List already exists"})
  }

  //get the number of lists the have been created 
  
  const numOfLists = fs.readdirSync('./Lists').filter(file => file.endsWith('.json'))

  // Filter files based on the owner's email address
  const userSpecificLists = numOfLists.filter(file => {
    const filePath = path.join('./Lists', file);
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // Check if any object in the array has the specified owner
    const hasMatchingOwner = fileContent.some(obj => obj.Owner && obj.Owner[0] === owner);
    return hasMatchingOwner;  
  });
  const num = userSpecificLists.length
  
  //if 20 lists have already been created send an error message 
  if(num === 20){
    return res.status(400).json({ message: "Number of lists cannot exceed 20" });
  }

  const currentDate = new Date();

  //new list content 
  const newList = [
    {"Owner": [owner]},
    {"View": ["private"]},
    {"Description": [description]},
    {"Reviews": []},
    {"Modification": [currentDate]},
    {"IDs": [IDs]}
  ]

  //create the list with the specified name anad send confirmation message 
  fs.writeFileSync(`Lists/${newName}.json`, JSON.stringify(newList))
  res.json({message: "New list created"})
})


//delete a custom made list 
router.delete("/deleteList", (req, res) => {

  //get the requested list name 
  const listN = req.body.title.toLowerCase(); 

  //if the file does not exist send error message 
  if(!fs.existsSync(`Lists/${listN}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //if it does exist then delete the list and send a confirmation message 
  fs.unlinkSync(`Lists/${listN}.json`)
  res.json({message: "List has been deleted"})
  
})

//add hero id to the requested custom made list 
router.put("/addHero", (req, res) =>{

  //get the input values 
  const listN = req.body.title.toLowerCase(); 
  const heroID = req.body.IDs;
  const replace = req.body.replace.toLowerCase();

  //if the list does not exist then send an error message 
  if(!fs.existsSync(`Lists/${listN}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //get the current data of the list 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${listN}.json`))
  console.log(currentData[5])

  //if specified to delete that hero id 
  if (replace == "yes"){
    
    //get the index of the id 
    const index = currentData[5].IDs[0].indexOf(heroID)

    //remove the id from the list 
    currentData[5].IDs[0].splice(index, 1)

    //write the updated data back into the list 
    fs.writeFileSync(`Lists/${listN}.json`, JSON.stringify(currentData))
    res.json({message: "Hero removed from list"})

  }else if (replace == "no"){

    // const IDString = heroID.toString();
    currentData[5].IDs[0].push(...heroID);

    //push the data into the list and send confirmation message 
    fs.writeFileSync(`Lists/${listN}.json`, JSON.stringify(currentData))
    res.json({message: "Hero added to list"})

  } else{
    //get the current data of the list 
    const currentData = JSON.parse(fs.readFileSync(`Lists/${listN}.json`))
    //get the length of the ids 
    const length = currentData[5].IDs[0].length
    //clear the data from the ids 
    currentData[5].IDs[0].splice(0,length)
    //write the cleared data back into the list 
    fs.writeFileSync(`Lists/${listN}.json`, JSON.stringify(currentData))
    res.json({message: "List cleared and heroes added to list"})
  }


  const currentDate = new Date();

  currentData[4].Modification[0] = currentDate

  fs.writeFileSync(`Lists/${listN}.json`, JSON.stringify(currentData));

})






router.put("/editLists", (req, res) =>{

  const name = req.body.name
  const description = req.body.des
  const visibility = req.body.visibility
  const title = req.body.title

  let change = "False"

  //if the file does not exist send error message 
  if(!fs.existsSync(`Lists/${title}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  if(description !== ""){
    //get the current data of the list 
    const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))
    console.log(currentData[2].Description[0])

    currentData[2].Description[0] = description

    fs.writeFileSync(`Lists/${title}.json`, JSON.stringify(currentData));

    change = "True"
  }

  if(visibility !== ""){
    //get the current data of the list 
    const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))
    console.log(currentData[1].View[0])

    currentData[1].View[0] = visibility

    fs.writeFileSync(`Lists/${title}.json`, JSON.stringify(currentData));

    change = "True"
  }

  if(name !== ""){
    fs.renameSync(`Lists/${title}.json`, `Lists/${name}.json`)

    change = "True"
  }

  const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))
  const currentDate = new Date();

  currentData[4].Modification[0] = currentDate

  fs.writeFileSync(`Lists/${listN}.json`, JSON.stringify(currentData));

  if(change === "True"){
    // Send a response to the client
    return res.status(200).json({message: "List updated successfully"})
  }else{
    return res.status(400).json({message: "No changes were made"})
  }

})












//get the ids currently inside a list name 
router.get("/getIDs/:listName", (req, res) =>{
  //get the list name 
  const listN = req.params.listName.toLowerCase()

  //if the list does not exist send error message 
  if(!fs.existsSync(`Lists/${listN}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //get the data from the specified list 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${listN}.json`))

  //send the current ids in the list 
  res.json(currentData[0].IDs)

})


//get the hero information and the powers for ids inside a custom list 
router.get("/getInfo/:listName", (req, res) =>{
  //get the list name 
  const listN = req.params.listName

  //if the list does not exist send error message 
  if(!fs.existsSync(`Lists/${listN}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //get the current ids in the list 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${listN}.json`))

  //get the number of ids inside the list 
  const length = currentData[5].IDs[0].length

  //sort the heroes based on id
  currentData[5].IDs.sort((a, b) => a.localeCompare(b));

  const customList = []

  //for each id inside the list 
  for(let i=0; i<length; i++){
    //get the current id 
    const currentID = currentData[5].IDs[0][i]

    //get the corresponding hero for the id 
    const heroId = parseInt(currentID);
    const hero = data.find(hero => hero.id === heroId);
  
    //if the hero is found return it
    if (hero) {
      //add the hero data to the message 
      customList.push(hero)

      //search the power data for the object with the found hero name 
      const powers = power.find(p => p.hero_names === hero.name);

      //if it exists run it if not send an error message 
      if (powers) {

        //search the data for the names of the powers set equal to true 
        const trueAbilities = Object.entries(powers).filter(([ability, hasAbility]) => hasAbility === 'True').map(([ability]) => ability);

        //if the data is found push it to the message if not send error message 
        if (trueAbilities.length > 0) {
          customList.push(({ Abilities: trueAbilities }));
        } else {
          //push this to ensure loop continues and show that no abilities exists
          customList.push(({ Abilities: "No abilities" })); 
        }
      } else {
        //push this to ensure loop continues since some heroes do not have powers section
        customList.push(({ Abilities: "No abilities available" }));
      }
    }
  }
  //send the hero information and power data 
  res.json(customList)
})


//get the names of the custom lists created 
router.post('/lists/j', (req, res) => {

  const username = req.body.email
  console.log(username)

  //read all the files under List and then filter in the ones that end in json
  const customListNames = fs.readdirSync('./Lists').filter(file => file.endsWith('.json'))
  
  // Filter files based on the owner's email address
  const userSpecificLists = customListNames.filter(file => {
    const filePath = path.join('./Lists', file);
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // Check if any object in the array has the specified owner
    const hasMatchingOwner = fileContent.some(obj => obj.Owner && obj.Owner[0] === username);
    return hasMatchingOwner;  
  });

  // Get just the beginning name and replace .json with ''
  const jsonFileNames = userSpecificLists.map(file => file.replace('.json', ''));
  res.json({files: jsonFileNames}) 

})



//get the names of the custom lists created 
router.post('/lists/public', (req, res) => {

  //read all the files under List and then filter in the ones that end in json
  const customListNames = fs.readdirSync('./Lists').filter(file => file.endsWith('.json'))
  
  // Filter files based on the owner's email address
  const userSpecificLists = customListNames.filter(file => {
    const filePath = path.join('./Lists', file);
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // Check if any object in the array has the specified owner
    const isPublic = fileContent.some(obj => obj.View && obj.View[0] === "public");
    return isPublic;  
  });
  console.log(userSpecificLists)

  // Get just the beginning name and replace .json with ''
  const jsonFileNames = userSpecificLists.map(file => file.replace('.json', ''));
  res.json({files: jsonFileNames}) 

})




router.post('/getListInfo', (req, res) => {

  const title = req.body.title
  console.log(title)

  //if the list does not exist send error message 
  if(!fs.existsSync(`Lists/${title}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //get the data from the specified list 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))
  console.log(currentData)

  res.json(currentData)

})



router2.post('/createUser', (req, res) => {

  const userN = req.body.userN
  const email = req.body.email
  const passW = req.body.passW

  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.find(user => email === user.email)

  if(user){
    return res.status(400).json({message: "User already exists with that email"})
  }

  bcrypt.hash(passW,10,(error, hashedPass) => {
    if (error) {
      return res.status(400).json({message: "Hashing error"})
    }
      const newUser = 
      {
        "username": userN,
        "email": email,
        "password": hashedPass,
        "status": "Active",
        "verification": "Unverified",
        "admin": "no"
      }

      users.users.push(newUser)

      fs.writeFileSync(`users.json`, JSON.stringify(users))

      return res.status(200).json({message: "User created successfully"})

    }
  )
})


router2.post('/confirmLogin', (req, res) => {

  const email = req.body.email
  const passW = req.body.passW

  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.find(user => email === user.email)
  
  if(!user){
    console.log("No user exists")
    return res.status(400).json({message: "No user with that email exists"})
  }

  const nickName = user.username 

  if(user.status == "Deactivated"){
    return res.status(400).json({message: "User account is disabled. Please contact the administrator. "})
  }

  if(user.verification == "Unverified"){
    return res.status(400).json({message: "Email has not been verified"})
  }

  const hashedPassword = user.password

  bcrypt.compare(passW, hashedPassword, (error, result) => {
    
    if(error){
      return res.status(500).json({message: "Error during login comparison"});
  } else if(result){
      console.log("Successful password comparison");

      const admin = user.admin
      let jwtData = {email, admin};
      const jwtToken = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: "1h",});
      return res.status(200).json({message: "Successful login", jwtToken, nickName})

  } else {
      console.log("Password comparison failed");
      return res.status(401).json({message: "Invalid password"});
  }

  })
})

router2.post('/emailConfirmation/:email', (req, res) => {

  const email = req.params.email

  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.findIndex(user => email === user.email)

  if(!user){
    return res.status(400).json({message: "No user with that email exists"})
  }

  users.users[user].verification = "Verified"

  fs.writeFileSync(`users.json`, JSON.stringify(users))

  return res.status(200).json({message: "Email has been verified"})

})


router3.post('/grantAdmin', (req, res) => {

  const email = req.body.email
  const adminTest = req.body.adminN

  console.log(email)

  const users = JSON.parse(fs.readFileSync(`users.json`))  

  const ad = users.users.find(user => adminTest === user.admin)

  if("admin123@gmail.com" !== adminTest || ad == "No"){
    return res.status(400).json({message: "You do not have administrator access"})
  }
  const changedUser = users.users.findIndex(user => email === user.email)

  if(!changedUser){
    return res.status(400).json({message: "No user with that email exists"})
  }

  users.users[changedUser].admin = "Yes"

  fs.writeFileSync(`users.json`, JSON.stringify(users))

  return res.status(200).json({message: "Administrator permissions have been given"})

})


router3.post('/deactivate', (req, res) => {

  const email = req.body.email
  const adminTest = req.body.adminN
  const type = req.body.type

  const users = JSON.parse(fs.readFileSync(`users.json`))  

  const ad = users.users.find(user => adminTest === user.admin)

  if("admin123@gmail.com" !== adminTest || ad == "No"){
    return res.status(400).json({message: "You do not have administrator access"})
  }
  const changedUser = users.users.findIndex(user => email === user.email)

  if(!changedUser){
    return res.status(400).json({message: "No user with that email exists"})
  }

  if(type == "deactiveate"){
    users.users[changedUser].status = "Deactiveated"
  } else if(type == "active"){
    users.users[changedUser].status = "Active"
  }

  fs.writeFileSync(`users.json`, JSON.stringify(users))

  return res.status(200).json({message: "This user has been deactivated"})

})




router3.post('/updatePassword', (req, res) => {

  const oldPass = req.body.oldPass
  const newPass = req.body.newPass
  const confirmPass = req.body.confirmPass
  const email = req.body.email 

  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.findIndex(user => email === user.email)

  if(!user){
    return res.status(400).json({message: "No user with that email exists"})
  }

  if (newPass != confirmPass){ 
    return res.status(400).json({message: "Passwords do not match"})
  }

  const storedHashedPassword = users.users[user].password;

  bcrypt.compare(oldPass, storedHashedPassword, (error, result) => {
    
    if(error) {
      return res.status(500).json({ message: "Error during password comparison" });

    } else if (!result) {
      return res.status(400).json({ message: "Old password is incorrect" });

    } else if(result){

      bcrypt.hash(newPass,10,(error, hashedPass) => {

        if (error) {
          return res.status(400).json({message: "Error during hashing "})
        }else{
        users.users[user].password = hashedPass

        fs.writeFileSync(`users.json`, JSON.stringify(users))

        return res.status(200).json({message: "Password has been changed."})
        }
      })
    }

  })
})




router.post('/addReview', (req, res) => {

  const rating = req.body.rate 
  const comment = req.body.comment
  const title = req.body.title
  const userN = req.body.userN

  //if the file does not exist send error message 
  if(!fs.existsSync(`Lists/${title}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //get the current data of the list 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))

  const currentDate = new Date()

  let review = {Rating: rating, Comment: comment, User: userN, Posted: currentDate}

  currentData[3].Reviews.push(review)

  fs.writeFileSync(`Lists/${title}.json`, JSON.stringify(currentData));

  res.json({message: "Review added to the List"})

})




//install routers
app.use('/api/heroes', router)
app.use('/api/users', router2)
app.use('/api/auth', router3)

//open port 
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
