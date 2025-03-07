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
const path =require('path');

// app.use(express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

const Movies = Models.Movie;
const Users = Models.User;
const CONNECTION_URI = process.env.CONNECTION_URI || 'mongodb://localhost:27017/myFlixDB';


// Connect to MongoDB
mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// CORS setup
let allowedOrigins = ['http://localhost:4200','http://localhost:8080', 'http://testsite.com','http://localhost:1234','https://myflix-movies-oj.netlify.app','https://olivias-jin.github.io','https://myflix-movie-frontend.s3.us-east-1.amazonaws.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {//If a speific origin isn't found on the list of allowed origin
            let message = 'The CORS policy for this application doesn`t allow access from origin' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

app.use(bodyParser.json());

// authentication 
let auth = require('./auth')(app);
app.use(passport.initialize());


// Serve static files from the "public" directory

app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Movie API');
});


app.get('/protected-route', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('This is a protected route');
});


app.use(passport.initialize());


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


// READ Movie by Title  
app.get('/movies/:title', async (req, res) => {
    try {
        const movie = await Movies.findOne({ Title: req.params.title });
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// READ users by username  
app.get('/users/:Username', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.Username });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});



//Get movies by genre 
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const genreName = req.params.name; // Get the genre name from the request parameters
        const movies = await Movies.find({ 'Genre.Name': genreName }); // Find movies with the specified genre

        if (movies.length > 0) { // Check if any movies were found
            res.status(200).json({ success: true, movies }); // Return found movies
        } else {
            res.status(404).json({ success: false, message: 'No movies found for the genre: ' + genreName }); // Handle no movies found
        }
    } catch (err) {
        console.error('Error fetching movies by genre:', err); // Log any errors with context
        res.status(500).json({ success: false, message: 'Error: ' + err.message }); // Return internal server error
    }
});



// GET director's details by name 
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log('Request received for director:', req.params.name);  // Log to check the request

    try {
        const movie = await Movies.findOne({ 'Director.Name': { $regex: new RegExp(`^${req.params.name}$`, 'i') } });

        if (movie) {
            res.json(movie.Director);  // Return the director's details
        } else {
            res.status(404).send(`Director with the name ${req.params.name} was not found.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
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
        return res.status(403).send('Permission denied'); // 403 for forbidden
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('No fields to update.');
    }

    try {
        // Check if the user exists
        const user = await Users.findOne({ Username: req.params.Username });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (req.body.Password) {
            req.body.Password = await bcrypt.hash(req.body.Password, 10); // Hash new password
        }

        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error: ' + err.message);
});



// Add a favorite movie to a user
app.post('/users/:Username/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(403).send('Permission denied');
    }
    try {
        const user = await Users.findOne({ Username: req.params.Username });
        if (!user) {
            return res.status(404).send('No such user');
        }

        const movie = await Movies.findOne({ Title: req.params.Title });
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        // Ensure FavoriteMovies array exists
        if (!user.FavoriteMovies) {
            user.FavoriteMovies = []; // Initialize if undefined
        }

        // Check if the movie ObjectId is already in the user's favorites
        if (!user.FavoriteMovies.map(String).includes(String(movie._id))) {
            user.FavoriteMovies.push(movie._id); // Use ObjectId
            await user.save();
            res.status(200).json(`${req.params.Title} has been added to ${req.params.Username}'s favorites.`);
        } else {
            res.status(400).send(`${req.params.Title} is already in favorites.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// Remove favorite movie from user
app.delete('/users/:Username/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(403).send('Permission denied');
    }
    try {
        // Find the user by Username
        const user = await Users.findOne({ Username: req.params.Username });
        if (!user) {
            return res.status(404).send(`${req.params.Username} was not found.`);
        }

        // Find the movie by title to get its ObjectId
        const movie = await Movies.findOne({ Title: req.params.Title });
        if (!movie) {
            return res.status(404).send(`${req.params.Title} was not found.`);
        }

        // Ensure that FavoriteMovies is defined and is an array
        if (!Array.isArray(user.FavoriteMovies)) {
            return res.status(400).send('FavoriteMovies list is not properly defined.');
        }

        // Find the index of the movie ObjectId in the user's FavoriteMovies array
        const movieIndex = user.FavoriteMovies.indexOf(movie._id);

        if (movieIndex > -1) {
            // Movie found, remove it from the array
            user.FavoriteMovies.splice(movieIndex, 1);
            await user.save(); // Save the updated user
            res.status(200).send(`${req.params.Title} has been removed from ${req.params.Username}'s favorites.`);
        } else {
            res.status(404).send(`${req.params.Title} is not in ${req.params.Username}'s favorites.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});

// DELETE user 
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOneAndDelete({ Username: req.params.Username });
        if (!user) {
            return res.status(404).send(req.params.Username + ' was not found.');
        }
        res.status(200).send(req.params.Username + ' was deleted.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});




const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});