
/*const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
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




}*/


const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

//const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

function generateUniqueID() {
    // Get current timestamp in milliseconds
    const timestamp = Date.now().toString();

    // Generate a random number (between 0 and 9999)
    const randomNumber = Math.floor(Math.random() * 10000).toString();

    // Combine timestamp and random number
    const combinedString = timestamp + randomNumber;

    // Generate a hash (SHA-256) of the combined string
    const hash = crypto.createHash('sha256').update(combinedString).digest('hex');

    // Extract the first 12 characters of the hash to ensure it's less than 13 characters long
    const uniqueID = hash.substring(0, 12);

    return uniqueID;
}

const app = express();
const port = 3000;

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SpringL0g010!',
    database: 'registration',
    port:"3306"
  });

  
connection.connect(err => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as ID ' + connection.threadId);
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.post('/register', async (req, res) => {
    const { fullname, email, password, phone } = req.body;
    const id = generateUniqueID(); // Generate a unique ID
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const sql = 'INSERT INTO users (id, fullname, email, password, phone) VALUES (?, ?, ?, ?, ?)';
connection.query(sql, [id, fullname, email, hashedPassword, phone], (error, results) => {
    if (error) {
        console.error('Database error:', error); // Log the actual error to the console for debugging purposes
        res.status(500).json({ message: 'Database error', error: error.message }); // Include the error message in the response
        return;
    }
        res.json({ message: 'Registration successful!', userId: id });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.json({ success: true });
                } else {
                    res.json({ success: false, message: 'Invalid email or password' });
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    });
});


// Changing details
app.post('/update', function(req, res) {
    const { old_pass, new_pass, conf_pass, old_email, new_email } = req.body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!old_email || !emailPattern.test(old_email)) {
        res.status(400).json({ success: false, message: 'Invalid old email address.' });
        return;
    }

    if (new_email && !emailPattern.test(new_email)) {
        res.status(400).json({ success: false, message: 'Invalid new email address.' });
        return;
    }

    if (new_pass && new_pass !== conf_pass) {
        res.status(400).json({ success: false, message: 'New password and confirmation password do not match.' });
        return;
    }

    connection.query('SELECT * FROM users WHERE email = ?', [old_email], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(old_pass, user.password, (err, result) => {
                if (err) {
                    console.error('Bcrypt error:', err);
                    res.status(500).json({ success: false, message: 'Internal server error' });
                    return;
                }

                if (result) {
                    const updates = {};
                    if (new_email) updates.email = new_email;
                    if (new_pass) {
                        const saltRounds = 10;
                        bcrypt.hash(new_pass, saltRounds, (err, hashedPassword) => {
                            if (err) {
                                console.error('Bcrypt error:', err);
                                res.status(500).json({ success: false, message: 'Internal server error' });
                                return;
                            }

                            updates.password = hashedPassword;
                            updateUserDetails(user.id, updates, res);
                        });
                    } else {
                        updateUserDetails(user.id, updates, res);
                    }
                } else {
                    res.json({ success: false, message: 'Invalid email or password' });
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    });
});

function updateUserDetails(userId, updates, res) {
    const query = 'UPDATE users SET ? WHERE id = ?';
    connection.query(query, [updates, userId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        res.json({ success: true, message: 'Details updated successfully' });
    });
}






// Home endpoint to serve home.html
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});





