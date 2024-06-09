const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Default route to login need to change 
app.get('/', function(req, res) {
    res.sendFile('public/login.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}
    });
});

// change it to get the login needs to comapre in database
app.post('/auth/login', function(req, res) {
    let loginObj = {
        "username": req.body.lg_username,
        "password": req.body.lg_password
        // use database here 
    };

    // Still need to return an error message to notify the user as to why they did not log in
});


// change it to get the login details and insert in database

app.post('/auth/signup', function(req, res) {
    let signupObj = {
        "username": req.body.su_username,
        "email": req.body.su_email,
        "password": req.body.su_password,
        "password_conf": req.body.su_password_conf
    };


});

// Route to home
app.get('/home', (req, res) => {
    res.sendFile('public/home.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});

// Route to profile
app.get('/profile', (req, res) => {
    res.sendFile('public/profile.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});

// Route to basket/checkout
app.get('/home', (req, res) => {
    res.sendFile('public/checkout.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});


// Route to messages
app.get('/messages', (req, res) => {
    res.sendFile('./public/messages.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});

// Route to profile
app.get('/profile', (req, res) => {
    res.sendFile('public/profile.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}
    });
});



app.listen(port, ()=> {
    console.log('Server Running');
    console.log('http://localhost:3000/');
});














