require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended:false }));
app.set('view engine','ejs');


app.get('/', (req, res) => {
    res.send("App is running");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if(error){
        throw error;
    }
    console.log(`Listening on ${PORT}\nhttp://localhost:${PORT}`);
});