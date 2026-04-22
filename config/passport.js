const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db/queries');

passport.use(
    new LocalStrategy(
        { usernameField: 'email'},
        async (email, password, done) => {
            try{
                const user = await db.getUserByEmail(email);
                if(!user){
                    return done(null, false, { message: 'Incorrect Email'});
                }
                const match = await bcrypt.compare(password, user.password);
                if(!match){
                    return done(null, false, { message: 'Incorrect Password'});
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try{
        const user = await db.getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;