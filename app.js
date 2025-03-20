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
    }return null;
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
app.post('/thankyou', async (req, res) => {
    const newSong = {
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        playlist: req.body.playlist
    };

    const result = validateForm(newSong);
    if (!result.isValid) {
        return res.send(result.errors);
    }

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(
            `INSERT INTO songs (title, artist, genre, playlist) VALUES(?, ?, ?, ?)`,
            [newSong.title, newSong.artist, newSong.genre, newSong.playlist]
        );
        allSongs.push(newSong);
        res.render('thankyou', { newSong });
    } catch (err) {
        console.error(`Error inserting song: ${err}`);
        if (!res.headersSent) res.status(500).send(`Error inserting song into database`);
    } finally {
        if (conn) conn.release(); 
    }
});

//Display playlists by fetching song from the database
app.get('/playlists', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM songs');

        // Group songs by playlist while removing duplicates
        const playlists = {};
        rows.forEach(song => {
            const playlist = song.playlist;
            if (!playlists[playlist]) {
                playlists[playlist] = new Map();
            }
            const uniqueKey = `${song.title}-${song.artist}`;
            if (!playlists[playlist].has(uniqueKey)) {
                playlists[playlist].set(uniqueKey, song);
            }
        });

        // Convert Maps to arrays for rendering
        Object.keys(playlists).forEach(playlist => {
            playlists[playlist] = Array.from(playlists[playlist].values());
        });

        res.render('playlist', { playlists });
    } catch (err) {
        console.error(`Error fetching songs: ${err}`);
        if (!res.headersSent) res.status(500).send(`Error fetching songs from the database`);
    } finally {
        if (conn) conn.release();
    }
});

//Delete route for song
app.post('/delete/song/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const songId = req.params.id;
        await conn.query('DELETE FROM songs WHERE id = ?', [songId]);
        if (!res.headersSent) res.redirect('/playlists');
    } catch (err) {
        console.error(`Error deleting song: ${err}`);
        if (!res.headersSent) res.status(500).send('Error deleting song');
    } finally {
        if (conn) conn.release(); // Release connection
    }
});

//Delete route for playlist
app.post('/delete/playlist/:playlist', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const playlistName = req.params.playlist;
        await conn.query('DELETE FROM songs WHERE playlist = ?', [playlistName]);
        if (!res.headersSent) res.redirect('/playlists');
    } catch (err) {
        console.error(`Error deleting playlist: ${err}`);
        if (!res.headersSent) res.status(500).send('Error deleting playlist');
    } finally {
        if (conn) conn.release(); // Release connection
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
