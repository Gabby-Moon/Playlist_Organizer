import express from "express";

//Instantiate an Express application
const app = express();


app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));


const PORT = 3000;

app.get('/', (req, res) => {
    res.render('home');
});
app.post('/thankyou', (req,res)=>{
    res.render('thankyou');
});
app.get('/admin', (req,res)=>{
    res.render('playlists');
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});