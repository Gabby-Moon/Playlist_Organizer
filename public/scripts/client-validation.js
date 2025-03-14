document.getElementById('playlist-form').onsubmit = (event) => {
    clearErrors();
    let isValid = true;
    
    //validate title
    let title = document.getElementById('title').value.trim();
    if(title === ""){
        document.getElementById("err-title").style.display = "block";
        isValid =false;
    }

    //validate artist
    let artist = document.getElementById('artist').value.trim();
    if(artist === ""){
        document.getElementById("err-artist").style.display ="block";
        isValid= false;
    }

    // Allowed values for genre and playlist
    const allowedGenres = ["pop", "r&b", "lo-fi", "rock", "edm", "blues", "country"];
    const allowedPlaylists = ["general", "workout", "study", "happy", "sad", "romantic"];


    //validate genre
    let genre = document.getElementById("genre").value;
    if (!allowedGenres.includes(genre)) {
        document.getElementById("err-genre").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("err-genre").style.display = "none";
    }


    //validate playlist
    let playlist = document.getElementById("playlist").value;
    if (!allowedPlaylists.includes(playlist)) {
        document.getElementById("err-playlist").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("err-playlist").style.display = "none";
    }

    return isValid;
}

//Function to clear errors
function clearErrors(){
    let errors = document.getElementsByClassName("err");
    for(let i=0; i<errors.length; i++){
        errors[i].style.display ="none"
    }
}