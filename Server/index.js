//getting the required assets
const express = require('express')
const app = express()
require('dotenv').config();
let port = process.env.port
const fs = require('fs')
const bcrypt = require('bcrypt')
const router = express.Router()
const router2 = express.Router()
const router3 = express.Router()
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require("jsonwebtoken");
const Fuse = require('fuse.js');

app.use('/', express.static('my-app'));

const verify = (req, res, next) => {

  let token = req.headers.authorization 
  
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

///////////////////////////////////////////////////////////////////////////may not have used 
// Get all the heroes information
router.get('/', (req, res) => {
    res.json(data);
  });

  
/////////////////////////////////////////////////////////////////////////////may not have used 
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


//Get a heroes information from their name
router.get('/:name/information', (req, res) => {
  //get the name and search for the hero that matches it
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

// Function for soft matching using Fuse library
function fuzzySearch(data, query, keys) {
  const fuse = new Fuse(data, {
    keys: keys,
    threshold: 0.3, // Adjust the threshold based on your preference
  });

  return fuse.search(query);
}


//Search function based on the user input 
router2.post('/searchHeroes', (req, res) => {

  //get the search inputs 
  const nameR = req.body.nameR.toLowerCase()
  const raceR = req.body.raceR.toLowerCase()
  const pubR = req.body.publisherR.toLowerCase()
  let powerR = req.body.powerR.toLowerCase()


  //copy all of the data
  let results = data

  //if there is input in the name category filter the heroes for the name 
  if(nameR !== ""){
    results = fuzzySearch(results, nameR, ['name']);

    results = results.map(item => item.item);
  }

  //if there is input in the race category filter the heroes for the race 
  if (raceR !== ""){
    results = fuzzySearch(results, raceR, ['Race']);
    results = results.map(item => item.item);
  }

  //if there is input in the publisher category filter the heroes for the publisher 
  if (pubR !== ""){
    results = fuzzySearch(results, pubR, ['Publisher']);
    results = results.map(item => item.item);
  }

  //if there is input in the power category filter the heroes for the power 
  if (powerR !== ""){

    let newPowerR = powerR[0].toUpperCase() + powerR.slice(1)

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
            results = powerResult.flat()
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
router3.post('/createList', (req, res) => {

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

  //get the date of creation 
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
router3.delete("/deleteList", (req, res) => {

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
router3.put("/addHero", (req, res) =>{

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
    const index = currentData[5].IDs[0].indexOf(heroID.toString())
    console.log(index)

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

  //get the date of modification and add it to the list information
  const currentDate = new Date();
  currentData[4].Modification[0] = currentDate

  //write the new changed 
  fs.writeFileSync(`Lists/${listN}.json`, JSON.stringify(currentData));

})





//this will allow the user to edit their lists 
router3.put("/editLists", (req, res) =>{

  //get the required values 
  const name = req.body.name
  const description = req.body.des
  const visibility = req.body.visibility
  const title = req.body.title

  let oldtitle = title

  let change = "False"

  //if the file does not exist send error message 
  if(!fs.existsSync(`Lists/${title}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //if there is a description change 
  if(description !== ""){
    //get the current data of the list 
    const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))

    //update the description
    currentData[2].Description[0] = description

    //write the new changes into the file 
    fs.writeFileSync(`Lists/${title}.json`, JSON.stringify(currentData));

    //change to true 
    change = "True"
  }

  //if there is a visibility selection
  if(visibility !== ""){
    //get the current data of the list 
    const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))

    //change the visibility 
    currentData[1].View[0] = visibility

    //write the new changes into the file 
    fs.writeFileSync(`Lists/${title}.json`, JSON.stringify(currentData));

    //change to true 
    change = "True"
  }

  //if there is a name change 
  if(name !== ""){
    //rewrite the name of the file 
    fs.renameSync(`Lists/${title}.json`, `Lists/${name}.json`)

    oldtitle = name

    //change to true 
    change = "True"
  }

  //get the current data 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${oldtitle}.json`))

  //get the current date of the edit 
  const currentDate = new Date();

  //adjust for the new date 
  currentData[4].Modification[0] = currentDate

  //write the changes into the files 
  fs.writeFileSync(`Lists/${oldtitle}.json`, JSON.stringify(currentData));

  if(change === "True"){
    //send a response to the user is successful
    return res.status(200).json({message: "List updated successfully"})
  }else{
    //send a response to the user if no changes made 
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



//get the names of all the publci lists 
router.post('/lists/public', (req, res) => {

  //Read all the files under List and then filter in the ones that end in json
  const customListNames = fs.readdirSync('./Lists').filter(file => file.endsWith('.json'));

  //Get modification dates for each file
  const fileDetails = customListNames.map(file => {
      const filePath = path.join('./Lists', file);
      const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const modificationDate = fs.statSync(filePath).mtime;
      return {
          fileName: file.replace('.json', ''),
          modificationDate: modificationDate,
          isPublic: fileContent.some(obj => obj.View && obj.View[0] === 'public'),
      };
  });

  // Filter files based on whether its public
  const userSpecificLists = fileDetails.filter(file => file.isPublic);

  // Sort files based on modification date (newest to oldest)
  const sortedLists = userSpecificLists.sort((a, b) => b.modificationDate - a.modificationDate);

  // Get just the name and date 
  const jsonFileNames = sortedLists.map(file => ({
      name: file.fileName,
      modificationDate: file.modificationDate,
  }));

  //send the file names and date 
  res.json({ files: jsonFileNames }); 
})



//this will get all the information for a list 
router.post('/getListInfo', (req, res) => {

  //get the title 
  const title = req.body.title
  console.log(title)

  //if the list does not exist send error message 
  if(!fs.existsSync(`Lists/${title}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //get the data from the specified list 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))
  console.log(currentData)

  //send the data 
  res.json(currentData)
})


//this will create a new user for the site
router2.post('/createUser', (req, res) => {

  //retreive the required values 
  const userN = req.body.userN
  const email = req.body.email
  const passW = req.body.passW

  //search for an account already using that email 
  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.find(user => email === user.email)

  //if an account is found send an error message
  if(user){
    return res.status(400).json({message: "User already exists with that email"})
  }

  //hash the input password using bcrypt 
  bcrypt.hash(passW,10,(error, hashedPass) => {
    //if there is an error return it 
    if (error) {
      return res.status(400).json({message: "Hashing error"})
    }
    //make a new user object with the input values and hashed password 
      const newUser = 
      {
        "username": userN,
        "email": email,
        "password": hashedPass,
        "status": "Active",
        "verification": "Unverified",
        "admin": "no"
      }

      //add this new user to the user file
      users.users.push(newUser)

      //write this change into the file 
      fs.writeFileSync(`users.json`, JSON.stringify(users))

      //send a success response 
      return res.status(200).json({message: "User created successfully"})
    }
  )
})


//this will confirm the login 
router2.post('/confirmLogin', (req, res) => {

  //get the input values by the user 
  const email = req.body.email
  const passW = req.body.passW

  //determine if that user exists 
  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.find(user => email === user.email)
  
  //if it does not inform them that no user with that email exists
  if(!user){
    return res.status(400).json({message: "No user with that email exists"})
  }

  //get the username for the user 
  const nickName = user.username 

  console.log(user.status)
  //if the account has been deactivated inform the user 
  if(user.status == "Deactivated"){
    console.log("test")
    return res.status(400).json({message: "User account is disabled. Please contact the administrator at admin123@gmail.com. "})
  }

  //if the account is unverified inform the user 
  if(user.verification == "Unverified"){
    return res.status(400).json({message: "Email has not been verified"})
  }

  //get the hashed password
  const hashedPassword = user.password

  //compare the input password with the hashed password 
  bcrypt.compare(passW, hashedPassword, (error, result) => {
    
    //if there is an error report it 
    if(error){
      return res.status(500).json({message: "Error during login comparison"});

    //if there is no error 
    } else if(result){
      console.log("Successful password comparison");

      //create a jwt token and send it with the nickname 
      const admin = user.admin
      let jwtData = {email, admin};
      const jwtToken = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: "1h",});
      return res.status(200).json({message: "Successful login", jwtToken, nickName})

    //if there is no result then inform the user the password is incorrect 
    } else {
      console.log("Password comparison failed");
      return res.status(401).json({message: "Invalid password"});
    }
  })
})


//this will confirm the users email 
router2.post('/emailConfirmation/:email', (req, res) => {

  //get the users email 
  const email = req.params.email

  //determine if that user exists 
  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.find(user => email === user.email)
  
  //if it does not inform them that no user with that email exists
  if(!user){
    return res.status(400).json({message: "No user with that email exists"})
  }

  //change the verification in the users account to verified 
  user.verification = "Verified";

  //write in these new changes 
  fs.writeFileSync(`users.json`, JSON.stringify(users))

  //return a success message 
  return res.status(200).json({message: "Email has been verified"})

})


//this will grant admin abilities to other users
router3.post('/grantAdmin', (req, res) => {

  //get the email and admin test 
  const email = req.body.email
  const adminTest = req.body.adminN

  //get all the users
  const users = JSON.parse(fs.readFileSync(`users.json`))  

  const ad = users.users.find(user => adminTest === user.admin)

  //if the user if not the original admim inform them they can not grant admin 
  if("admin123@gmail.com" !== adminTest || ad == "No"){
    return res.status(400).json({message: "You do not have administrator access"})
  }

  //get the index of the user we want to grant admin to
  const changedUser = users.users.findIndex(user => email === user.email)

  //if they do not exist inform the user 
  if(!changedUser){
    return res.status(400).json({message: "No user with that email exists"})
  }

  //change the users admin status 
  users.users[changedUser].admin = "Yes"

  //write in the new changes 
  fs.writeFileSync(`users.json`, JSON.stringify(users))

  //return success message
  return res.status(200).json({message: "Administrator permissions have been given"})

})


//this will deactivate the user 
router3.post('/deactivate', (req, res) => {

  //get the required values 
  const email = req.body.email
  const adminTest = req.body.adminN
  const type = req.body.type

  //get the users
  const users = JSON.parse(fs.readFileSync(`users.json`)) 

  //if the user if not the original admim inform them they can not grant admin 
  const ad = users.users.find(user => adminTest === user.admin)
  if("admin123@gmail.com" !== adminTest || ad == "No"){
    return res.status(400).json({message: "You do not have administrator access"})
  }
  //get the index of the user we want to deactivate to
  const changedUser = users.users.findIndex(user => email === user.email)

  //if they do not exist inform the user 
  if(!changedUser){
    return res.status(400).json({message: "No user with that email exists"})
  }

  //adjust the status of the user based on the desired action by the admin
  if(type == "deactiveate"){
    users.users[changedUser].status = "Deactivated"
  } else if(type == "active"){
    users.users[changedUser].status = "Active"
  }

  //write the new changed into the user file
  fs.writeFileSync(`users.json`, JSON.stringify(users))

  //return a success statement
  return res.status(200).json({message: "This user has been deactivated"})

})


//this will update the password for the user 
router3.post('/updatePassword', (req, res) => {

  //get the required values 
  const oldPass = req.body.oldPass
  const newPass = req.body.newPass
  const confirmPass = req.body.confirmPass
  const email = req.body.email 

  //get the users and find the index of the user we want to change 
  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.findIndex(user => email === user.email)

  //if user doesn't exist or if password do not match return error 
  if(!user){
    return res.status(400).json({message: "No user with that email exists"})
  }
  if (newPass != confirmPass){ 
    return res.status(400).json({message: "Passwords do not match"})
  }

  //get the currnet hashed password 
  const storedHashedPassword = users.users[user].password;

  //compare the old password with the current stored password 
  bcrypt.compare(oldPass, storedHashedPassword, (error, result) => {
    
    //send error if occurs 
    if(error) {
      return res.status(500).json({ message: "Error during password comparison" });

    //if no results send error 
    } else if (!result) {
      return res.status(400).json({ message: "Old password is incorrect" });

    //if comparison works hash the new password
    } else if(result){

      bcrypt.hash(newPass,10,(error, hashedPass) => {

        if (error) {
          return res.status(400).json({message: "Error during hashing "})

        }else{
        //set the new password and write it into the user file 
        users.users[user].password = hashedPass
        fs.writeFileSync(`users.json`, JSON.stringify(users))

        //send success message 
        return res.status(200).json({message: "Password has been changed."})
        }
      })
    }
  })
})

//this will let the user add a review to a list 
router3.post('/addReview', (req, res) => {

  //get required values 
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

  //get the current date to update the modification date 
  const currentDate = new Date()

  //create the new review object with the values 
  let review = {Rating: rating, Comment: comment, User: userN, Posted: currentDate}

  //add it to the current reviews 
  currentData[3].Reviews.push(review)

  //write the changes into the list file 
  fs.writeFileSync(`Lists/${title}.json`, JSON.stringify(currentData));

  //send success response 
  res.json({message: "Review added to the List"})

})


//this will get the info meant to be shown to non users 
router.post('/getPublicInfo', (req, res) => {

  //get the title of the file 
  const title = req.body.title

  //if the list does not exist send error message 
  if(!fs.existsSync(`Lists/${title}.json`)){
    return res.status(400).json({message: "List does not exists"})
  }

  //get the data from the specified list 
  const currentData = JSON.parse(fs.readFileSync(`Lists/${title}.json`))

  //create the required data array to be sent 
  const requiredData = []; 

  //add the title 
  requiredData.push(title)

  //get the users email 
  const email = currentData[0].Owner[0]

  //get the user information for that email 
  const users = JSON.parse(fs.readFileSync(`users.json`))  
  const user = users.users.find(user => email === user.email)

  //add the users email to the data 
  requiredData.push(user.username)

  //add the number of heroes to the data 
  const length = currentData[5].IDs[0].length
  requiredData.push(length)

  //get the average of the ratings and add it to the data 
  let ratingTotal = 0;
  const reviews = currentData[3].Reviews
  for (let i = 0; i < reviews.length; i++) {
    ratingTotal += parseInt(reviews[i].Rating);
  }
  const avgRating = ratingTotal / reviews.length;
  requiredData.push(avgRating)

  //send the data 
  res.json(requiredData)
})




//install routers
app.use('/api/heroes', router)
app.use('/api/users', router2)
app.use('/api/auth', router3)

//open port 
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
