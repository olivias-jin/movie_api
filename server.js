// validator
const { check, validationResult } = require('express-validator');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const Models = require('./models.js');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();

const Movies = Models.Movie;
const Users = Models.User;
const CONNECTION_URI = process.env.CONNECTION_URI;


// Connect to MongoDB
mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// CORS setup
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

app.use(bodyParser.json());
app.use(passport.initialize());

// Basic route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Movie API');
});

// CREATE user
app.post('/users', [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    let hashedPassword = await bcrypt.hash(req.body.Password, 10); // Hashing the password
    try {
        let user = await Users.findOne({ Username: req.body.Username });
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            user = await Users.create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            });
            res.status(201).json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// READ users
app.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Update user by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $set: req.body },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Add a favorite movie to a user
app.post('/users/:id/movies/:movieTitle', async (req, res) => {
    const { id, movieTitle } = req.params;

    try {
        let user = await Users.findById(id);
        if (user) {
            user.favoriteMovies.push(movieTitle);
            await user.save();
            res.status(200).json(`${movieTitle} has been added to user ${id}'s favorites.`);
        } else {
            res.status(400).send('No such user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Users.findByIdAndDelete(id);
        if (user) {
            res.status(200).send(`User ${id} has been deleted.`);
        } else {
            res.status(400).send('No such user');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while deleting the user.');
    }
});

// READ movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movies.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});