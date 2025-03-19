import express from "express";
import mariadb from "mariadb";
import dotenv from "dotenv"
import { validateForm } from './services/validation.js';

dotenv.config();

//Define our database credentials
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

//Define function to connect to the DB
async function connect(){
    try{
        const conn = await pool.getConnection();
        console.log('Connect to the database!')
        return conn;
    }catch (err){
        console.log(`Error connecting to the database ${err}`)
    }
}

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

//List for all songs in all playlists
const allSongs = [];

//Define a "default" route for our home page
app.get('/', (req, res) => {
    res.render('home' );
});
app.post('/thankyou', async(req,res)=>{
    //get newSong from the form
    const newSong = {
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        playlist: req.body.playlist
    };

    //validate form data
    const result =validateForm(newSong);
    if(!result.isValid){
        res.send(result.errors);
        return;
    }

    //Insert the new song into the database
    const conn = await connect();
    try{
        await conn.query(
            `INSERT INTO songs (title, artist, genre, playlist)
            VALUES(?, ?, ?, ?)`,
            [newSong.title, newSong.artist, newSong.genre, newSong.playlist ]
        );
        allSongs.push(newSong);
    res.render('thankyou', { newSong });
    }catch (err){
        console.error(`Error inserting song: ${err}`);
        res.status(500).send(`Error inserting song into database`);
    
    }
    
});

//Display playlists by fetching song from the database
app.get('/playlists', async(req,res)=>{
    const conn =await connect();
    try{
        const rows = await conn.query('SELECT * FROM songs');
        res.render('playlist', { songs: rows });
    }catch (err){
        console.error(`Error fetching songs: ${err}`);
        res.status(500).send(`Error fetching songs from the database`);

    }finally{
        conn.end();
    }
   
});

//Admin route
app.get('/admin', async (req,res)=>{
    res.send(allSongs);
})

//start server
app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});
