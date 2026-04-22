require('dotenv').config();

const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');``

app.use(express.urlencoded({ extended:false }));
app.set('view engine','ejs');

app.use('/', authRoutes);
app.get('/', (req, res) => {
    res.send('Home');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if(error){
        throw error;
    }
    console.log(`Listening on ${PORT}\nhttp://localhost:${PORT}`);
});