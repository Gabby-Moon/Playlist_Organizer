import express from "express";
import { validateForm } from './services/validation.js';

//Instantiate an Express application
const app = express();

//Middleware to parse form data
app.use(express.urlencoded({extended: true}));

//Middleware to parse form data
app.set('view engine', 'ejs');

//Serve static files from the 'public' directory
app.use(express.static('public'));

//Define a port number for our server to listen on
const PORT = 3000;

//Define a "default" route for our home page
app.get('/', (req, res) => {
    res.render('home' );
});
app.post('/thankyou', (req,res)=>{
    //get newSong from the form
    const newSong = {
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        playlist: req.body.playlist
    };

    const result =validateForm(newSong);
    if(!result.isValid){
        res.send(result.errors);
        return;
    }
    res.render('thankyou', { newSong });
});

app.get('/playlists', (req,res)=>{
    res.render('playlists');
});



app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});