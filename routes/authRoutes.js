const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const db = require('../db/queries');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    const messages = await db.getAllMessages();
    res.render('index', {
        messages,
        success: req.query.success || null,
     });
});

router.get('/sign-up', (req, res) => {
    res.render('sign-up', {
        errors: [],
        oldData: {},
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
        res.redirect('/log-in');
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
            return res.redirect('/?success=Logged in successfully');
        });
    })(req, res, next);
});

router.get('/log-out', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        return res.redirect('/?success=Logged out successfully');
    });
});

router.get('/create-message', isAuthenticated, (req, res) => {
    res.render('create-message');
});
router.post('/create-message', isAuthenticated, async(req, res) => {
    const { title, text } = req.body;
    await db.createMessage({
        title,
        text,
        userId: req.user.id,
    });
    res.redirect('/?success=Message created');
});

router.get('/join', isAuthenticated, (req, res) => {
    res.render('join', { error:null });
});
router.post('/join', isAuthenticated, async(req, res) => {
    const { passcode } = req.body;
    const secret = 'GLaDOS';
    if(passcode === secret){
        await db.makeMember(req.user.id);
        return res.redirect('/?success=You are now a member');
    }
    res.render('join', {error:'Incorrect Passcode'});
});

router.get('/become-admin', isAuthenticated, (req, res) => {
    res.render('admin', { error: null });
});
router.post('/become-admin', isAuthenticated, async(req, res) => {
    const { passcode } = req.body;
    const secret = 'verwalter';
    if(passcode === secret){
        await db.makeAdmin(req.user.id);
        return res.redirect('/?success=You are now an admin');
    }
    res.render('admin', {error:'Incorrect Passcode'});
});

router.post('/delete-message/:id', isAuthenticated, async(req, res) => {
    if(!req.user.is_admin){
        return res.redirect('/?success=Admin access required');
    }
    const messageId = req.params.id;
    await db.deleteMessages(messageId);
    res.redirect('/?success=Message Deleted');
});

module.exports = router;