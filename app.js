require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./config/passport');
const pool = require('./db/pool')
const authRoutes = require('./routes/authRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
    }), 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended:false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use('/', authRoutes);
app.get('/', (req, res) => {
    if (req.user){
        res.send(`Logged in as ${req.user.email}`);
    } else {
        res.send('Not logged in');
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if(error){
        throw error;
    }
    console.log(`Listening on ${PORT}\nhttp://localhost:${PORT}`);
});