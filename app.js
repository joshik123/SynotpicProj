
const express = require('express');
// const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

app.use(bodyParser.json());
app.use(cors());

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
            res.status(404).json({ message: 'Email not found' });
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
                        res.status(404).json({ message: 'Current email not found' });
                    } else {
                        res.json({ message: 'Email and password changed successfully' });
                    }
                });
            });
        });
    });
});

// Path to the JSON file
const filePath = path.join(__dirname, 'items.json');

// Endpoint to receive and store item details
app.post('/items', (req, res) => {
    const newItem = req.body;

    // Read the existing data from the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Failed to read data' });
        }

        let items = [];
        if (data) {
            items = JSON.parse(data);
        }

        // Add the new item to the array
        items.push(newItem);

        // Write the updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(items, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save data' });
            }
            res.status(201).json(newItem);
        });
    });
});

// Endpoint to get all items
app.get('/items', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        const items = data ? JSON.parse(data) : [];
        res.json(items);
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





