const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const mysql = require('mysql');


app.use(express.static('public'));


// Default route to index need to change 
app.get('/', function(req, res) {
    res.sendFile('public/index.html', {root: __dirname}, (err) => {
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

// Route to contact
app.get('/contact', (req, res) => {
    res.sendFile('public/contact.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});



// Route to volunteer
app.get('/profile', (req, res) => {
    res.sendFile('public/volunteer.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});

// Route to shop
app.get('/shop', (req, res) => {
    res.sendFile('public/shop.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});


// Route to messages
app.get('/about', (req, res) => {
    res.sendFile('public/about.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}    
    });
});

// Route to donate
app.get('/donate', (req, res) => {
    res.sendFile('public/donate.html', {root: __dirname}, (err) => {
        if (err) {console.log(err);}
    });
});



app.listen(port, ()=> {
    console.log('Server Running');
    console.log('http://localhost:3000/');
});



// Create a connection to the database
const connection = mysql.createConnection({
    host: '127.0.0.1',    
    user: 'root',          
    password: 'pass',  

});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Close the connection
connection.end((err) => {
    if (err) {
        console.error('Error closing the connection:', err);
        return;
    }
    console.log('Connection to the MySQL server closed.');
});
