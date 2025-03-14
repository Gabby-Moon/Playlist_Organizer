export function validateForm(data){

    //store all the validation errors in an array
    const errors=[ ];

    //validate title
    if(!data.title || data.title.trim()=== ""){
        errors.push("Title is required");
    }

    //validate artist
    if(!data.artist || data.artist.trim()=== ""){
        errors.push("Artist is required");
    }

    //validate genre
    if(data.genre ==="none"){
        errors.push("Select a Genre");
     }else{
        const validOptions = ["pop", "r&b", "lo-fi", "rock", "edm", "blues", "country"];
        if(!validOptions.includes(data.genre)){
            errors.push("Invalid genre selection!");
        }
     }
    

    //validate for playlist
    if(data.playlist ==="none"){
        errors.push("Select a Playlist");
    }else{
        const validOptions = ["general", "workout", "study", "happy", "sad", "romantic"];
        if(!validOptions.includes(data.playlist)){
            errors.push("Invalid playlist selection");
        }
    }


    return{
        isValid: errors.length === 0,
        errors
    }



}