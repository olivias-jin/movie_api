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
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors());


app.use(bodyParser.json());
app.use(passport.initialize());

// Basic route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Movie API');
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
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.Name})
        .then((genre) => {
            if (genre) {
                res.json(genre);
            } else {
                res.status(404).send(
                    'Genre with the name ' + req.params.Name + ' was not found.'
                );
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
  });



// GET director's details by name 
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log('Request received for director:', req.params.name);  // Log to check the request
    
    try {
        const movie = await Movies.findOne({ 'Director.Name': req.params.name });
        
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
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
 await Users.findOneAndUpdate({Username:req.params.Username},
  {
    $set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    },

  },
  {new: true}
 )
 .then((updatedUser) => {
  res.json(updatedUser);
})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
});
});



// Add a favorite movie to a user
app.post('/users/:Username/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.Username });
        
        if (user) {
            // Check if the movie is already in the user's favorites
            if (!user.favoriteMovies.includes(req.params.Title)) {
                user.favoriteMovies.push(req.params.Title);
                await user.save();
                res.status(200).json(`${req.params.Title} has been added to ${req.params.Username}'s favorites.`);
            } else {
                res.status(400).send(`${req.params.Title} is already in favorites.`);
            }
        } else {
            res.status(404).send('No such user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// Remove favorite movie to user 
app.delete('/users/:Username/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.Username });
        if (user) {
            user.favoriteMovies = user.favoriteMovies.filter(movie => movie !== req.params.Title);
            await user.save();
            res.status(200).json(`${req.params.Title} has been removed from ${req.params.Username}'s favorites.`);
        } else {
            res.status(404).send('No such user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
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


// DELETE id 
app.delete('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
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








const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});