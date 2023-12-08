//function to remove any html tags to prevent them from being sent to the backend
export function removeTags(inputText){
    //if the input does not exist end the function
    if((inputText === null) || (inputText === "")){
      return 
    }
    else{
      //if the input exists replace any html tags with ''
      return inputText.replace(/(<([^>]+)>)/ig, '')
    }
  }