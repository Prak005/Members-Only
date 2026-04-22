require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false}));
app.use(express.urlencoded({ extended:false }));

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