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
    //get playlist from the form
    const playlist=req.body;

    const result =validateForm(playlist);
    if(!result.isValid){
        res.send(result.errors);
        return;
    }
    res.render('thankyou');
});

app.get('/admin', (req,res)=>{
    res.render('playlists');
});



app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});