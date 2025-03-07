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

    //validate genre
    let genere = document.getElementById("genre").value;
    if(genere === "none"){
        document.getElementById("err-genre").style.display ="block";
        isValid = false;
    }


    //validate playlist
    let playlist = document.getElementById("playlist").value;
    if(playlist === "none"){
        document.getElementById("err-playlist").style.display ="block";
        isValid = false;
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