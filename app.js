
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




// Replace with your MongoDB connection string
const uri = 'your_mongodb_connection_string_here';

// Replace with your database and collection names
const dbName = 'your_database_name';
const collectionName = 'users';

const bcrypt = require('bcrypt');

async function signupUser(userData) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        // Connect to the MongoDB cluster
        await client.connect();

        // Select the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the new user data
        const result = await collection.insertOne(userData);
        console.log(`New user inserted with the following id: ${result.insertedId}`);
    } catch (err) {
        console.error('Error inserting user:', err);
    } finally {
        // Close the connection to the database
        await client.close();
    }
}*/
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

//const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

function generateUniqueID() {
    
    const timestamp = Date.now().toString();

    
    const randomNumber = Math.floor(Math.random() * 10000).toString();

    
    const combinedString = timestamp + randomNumber;

   
    const hash = crypto.createHash('sha256').update(combinedString).digest('hex');

    
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
        console.error('Database error:', error); 
        res.status(500).json({ message: 'Database error', error: error.message }); 
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


// app.post('/update', (req, res) => {
//     const { currentEmail, newEmail } = req.body;
    
//     const sql = 'UPDATE users SET email = ? WHERE email = ?';
//     connection.query(sql, [newEmail, currentEmail], (error, results) => {
//         if (error) {
//             console.error('Database error:', error);
//             res.status(500).json({ message: 'Database error', error: error.message });
//             return;
//         }
//         if (results.affectedRows === 0) {
//             res.status(404).json({ message: 'Current email not found' });
//         } else {
//             res.json({ message: 'Email changed successfully' });
//         }
//     });
// });

app.post('/settings', (req, res) => {
    const { currentEmail, newEmail, currentPassword, newPassword } = req.body;

    if (!currentEmail || !newEmail || !currentPassword || !newPassword) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const fetchSql = 'SELECT password FROM users WHERE email = ?';
    connection.query(fetchSql, [currentEmail], (fetchError, fetchResults) => {
        if (fetchError) {
            console.error('Database error:', fetchError);
            res.status(500).json({ message: 'Database error', error: fetchError.message });
            return;
        }

        if (fetchResults.length === 0) {
            res.status(404).json({ message: 'Current email not found' });
            return;
        }

        const hashedCurrentPassword = fetchResults[0].password;

        bcrypt.compare(currentPassword, hashedCurrentPassword, (compareError, isMatch) => {
            if (compareError) {
                console.error('Password comparison error:', compareError);
                res.status(500).json({ message: 'Password comparison error', error: compareError.message });
                return;
            }

            if (!isMatch) {
                res.status(401).json({ message: 'Incorrect current password' });
                return;
            }

            bcrypt.hash(newPassword, 10, (hashError, hashedNewPassword) => {
                if (hashError) {
                    console.error('Hashing error:', hashError);
                    res.status(500).json({ message: 'Hashing error', error: hashError.message });
                    return;
                }

                const updateSql = 'UPDATE users SET email = ?, password = ? WHERE email = ?';
                connection.query(updateSql, [newEmail, hashedNewPassword, currentEmail], (updateError, updateResults) => {
                    if (updateError) {
                        console.error('Database error:', updateError);
                        res.status(500).json({ message: 'Database error', error: updateError.message });
                        return;
                    }

                    if (updateResults.affectedRows === 0) {
                        res.status(404).json({ message: 'Update failed, current email not found' });
                    } else {
                        res.json({ message: 'Email and password changed successfully' });
                    }
                });
            });
        });
    });
});






app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/settings.html'));
});
app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/list.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/contact.html'));
});
app.get('/donate', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/donate.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});





