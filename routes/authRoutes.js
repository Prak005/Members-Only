const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/sign-up', (req, res) => {
    res.render('sign-up', {
        errors: [],
        oldData: [],
    });
});
router.post('/sign-up',
    [
        body('firstName').trim().notEmpty().withMessage('First Name required'),
        body('lastName').trim().notEmpty().withMessage('Last Name required'),
        body('email').isEmail().withMessage('Invalid Email').custom(async (email) => {
            const user = await db.getUserByEmail(email);
            if (user) {
                throw new Error('User already exists');
            }
            return true;
        }),
        body('password').isLength({min:6}).withMessage('Password must be atleast 6 characters long'),
        body('confirmPassword').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('sign-up', {
                errors: errors.array(),
                oldData: req.body,
            });
        }
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createUser({firstName, lastName, email, password:hashedPassword});
        res.send('New User Created');
    }
);

router.get('/log-in', (req, res) => {
    res.render('log-in', { errors: [] });
});
router.post('/log-in', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err)
            return next(err);
        if(!user){
            return res.render('log-in', {
                errors: [info.message],
            });
        }
        req.login(user, (err) => {
            if(err)
                return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/log-out', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        return res.redirect('/');
    });
});

module.exports = router;