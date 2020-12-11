const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/user/login', (req,res) => {
    res.render('user/login');
});

router.post('/user/login', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.get('/user/signup', (req,res) => {
    res.render('user/signup');
});

router.post('/user/signup', async (req,res) => {
    const { name, email, adress, password, confirm_password } = req.body;
    const errors = [];

    if(name.length <= 0 || email.length <= 0 || password.length <=0){
        errors.push({text: 'please fill in all the fields'})
    }
    if (password != confirm_password){
        errors.push({text:'Password do not match!'})
    }
    if (password.length < 4 ){
        errors.push({text:'Password must have at least 4 characters!'})
    }
    if(errors.length > 0){
        res.render('user/signup', {errors, name, email, adress, password, confirm_password});
    }
    else {
        const emailUser = await User.findOne({email:email})
        if (emailUser){
            req.flash('error_msg', 'email already in use')
            res.redirect("/user/signup")
        }
        const newUser = new User({name, email, adress, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Registrado correctamente');
        res.redirect('/user/login');
    }
});

router.get('/user/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;