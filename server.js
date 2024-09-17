// validator
const { check, validationResult } = require('express-validator');
// check('Username','Username contains non-alphanumeric characters - not allowed.').isAlphanumeric()

// Importing passport
const passport = require('passport');

const mongoose = require('mongoose');
const Models = require('./models.js');

// Exercise 3.4
// const Movies = Models.Movie;
const Movies = [];
const Users = Models.User;





mongoose.connect( process.env.CONNECTION_URI || 'mongodb://localhost:27017/myFlixDB',
  { useNewUrlParser: true, useUnifiedTopology: true });

  const express = require('express');
  const app = express();
  
// Cors
const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ //If a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn`t allow access from origin' + origin;
    return callback(new Error(message ), false);
  }
  return callback(null, true);
  } 
}));



bodyParser = require('body-parser');

// Importing auth.js
app.use(bodyParser.json());
let auth = require('./auth')(app);







uuid = require('uuid');




// Removing hardcoded: instead using MongoDB
// let users= [
//   {
//     id: 1,
//     name: "Jin",
//     favoriteMovies: []
//   },

//   {
//     id: 2,
//     name: "Vic",
//     favoriteMovies: ["Forrest Gump"]
//   }
// ];

// let movies = [
//   {
//     "Title": "Forrest Gump",
//     "Description": "a mentally challenged man with an IQ of 75 who plays an accidental role in some of the most significant events of the 20th century.",
//     "Genre": {
//       "Name": "Drama"
//     },
//     "Director": {
//       "Name": "Robert Zemeckis",
//       "Bio": "",
//       "Birth": "1952"
//     },
//     "imageURL": "https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "Spirited Away",
//     "Description": "Chihiro's journey to save her parents and how it represents her transition into adulthood.",
//     "Genre": {
//       "Name": "Animation"
//     },
//     "Director": {
//       "Name": "Hayao Miyazaki",
//       "Bio": "",
//       "Birth": "1963"
//     },
//     "imageURL": "https://www.imdb.com/title/tt0245429/mediaviewer/rm4207852801/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "Wall E",
//     "Description": "The last robot left on Earth, programmed to clean up the planet, one trash cube at a time.",
//     "Genre": {
//       "Name": "Animation"
//     },
//     "Director": {
//       "Name": "Andrew Stanton",
//       "Bio": "",
//       "Birth": "1965"
//     },
//     "imageURL": "https://www.imdb.com/title/tt0910970/mediaviewer/rm1659211008/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "Toy Story",
//     "Description": "Taking place in a world where toys come to life when humans are not present, the plot of Toy Story focuses on the relationship between an old-fashioned pullstring cowboy doll named Woody and a modern space cadet action figure, Buzz Lightyear, as Woody develops jealousy towards Buzz when he becomes their owner Andy's favorite toy.",
//     "Genre": {
//       "Name": "Animation"
//     },
//     "Director": {
//       "Name": "John Lasseter",
//       "Bio": "",
//       "Birth": "1957"
//     },
//     "imageURL": "https://www.imdb.com/title/tt0114709/mediaviewer/rm3813007616/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "3 Idiots",
//     "Description": "follows college best friends, Farhan (R. Madhavan) and Raju (Sharman Joshi), who drive down to Shimla in search for Rancho (Aamir Khan), their long-lost buddy.",
//     "Genre": {
//       "Name": "Comedy"
//     },
//     "Director": {
//       "Name": "Rajkumar Hirani",
//       "Bio": "",
//       "Birth": "1962"
//     },
//     "imageURL": "https://www.imdb.com/title/tt1187043/mediaviewer/rm2029391104/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "Up",
//     "Description": "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway.",
//     "Genre": {
//       "Name": "Animation"
//     },
//     "Director": {
//       "Name": "Pete Docter & Bob Peterson",
//       "Bio": "",
//       "Birth": "1968 & 1961"
//     },
//     "imageURL": "https://www.imdb.com/title/tt1049413/mediaviewer/rm3826338560/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "The Sixth Sense",
//     "Description": "Young Cole Sear (Haley Joel Osment) is haunted by a dark secret: he is visited by ghosts. Cole is frightened by visitations from those with unresolved problems who appear from the shadows. He is too afraid to tell anyone about his anguish, except child psychologist Dr. Malcolm Crowe (Bruce Willis).",
//     "Genre": {
//       "Name": "Psychological thriller"
//     },
//     "Director": {
//       "Name": "M. Night Shyamalan",
//       "Bio": "",
//       "Birth": "1970"
//     },
//     "imageURL": "https://www.imdb.com/title/tt0167404/mediaviewer/rm2099059456/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "Hacksaw Ridge",
//     "Description": "An intense and gripping war drama that tells the inspiring true story of Desmond Doss, a conscientious objector who served as a medic during World War II.",
//     "Genre": {
//       "Name": "War"
//     },
//     "Director": {
//       "Name": "Mel Gibson",
//       "Bio": "",
//       "Birth": "1956"
//     },
//     "imageURL": "https://www.imdb.com/title/tt2119532/mediaviewer/rm2660241152/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "Monsters, Inc",
//     "Description": "The city of Monstropolis in a world entirely populated by monsters is powered by energy from the screams of human children. At the Monsters, Inc., factory, skilled monsters employed as 'scarers' venture into the human world to scare children and harvest their screams, through doors that activate portals to children's bedroom closets.",
//     "Genre": {
//       "Name": "Animation"
//     },
//     "Director": {
//       "Name": "Pete Docter & David Silverman & Lee Unkrich",
//       "Bio": "",
//       "Birth": "1968 & 1957 & 1967"
//     },
//     "imageURL": "https://www.imdb.com/title/tt0198781/mediaviewer/rm2785401856/?ref_=tt_ov_i",
//     "feature": true
//   },
//   {
//     "Title": "The Truman Show",
//     "Description": "An insurance salesman is oblivious of the fact that his entire life is a TV show and his family members are mere actors.",
//     "Genre": {
//       "Name": "Comedy drama"
//     },
//     "Director": {
//       "Name": "Peter Weir",
//       "Bio": "",
//       "Birth": "1944"
//     },
//     "imageURL": "https://www.imdb.com/title/tt0120382/mediaviewer/rm1927354112/?ref_=tt_ov_i",
//     "feature": true
//   }
// ];





// //CREATE
// app.post('/users', (req, res) => {
//   const newUser = req.body;

//   if (newUser.name){
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser)
//   } else {
//     res.status(400).send('users need names')
//   }
// });


// //UPDATE
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   let user = users.find( user => user.id == id);

//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user);
//   } else{
//     res.status(400).send('no such user')
//   }

// })

app.get('/', (req, res) => {
  res.status(200).send('hello')
})

//UPDATE
app.put('/users/:id/:movieTitle', (req, res) => {
  const { favoriteMovies } = req.params;
  const updatedmovie = req.body;

  let user = Users.find( user => user.favoriteMovies == favoriteMovies);

  if (user) {
    user.favoriteMovies = updatedmovie.name;
    res.status(200).json(user);
  } else{
    res.status(400).send('no such movie Title')
  }

})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = Users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(`${movieTitle} has been added to user ${id}'s array`);
  } else{
    res.status(400).send('no such user')
  }

})


//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  Users.findByIdAndDelete(id)
    .then(user => {
      if (user) {
        res.status(200).send(`User ${id} has been deleted.`);
      } else {
        res.status(400).send('No such user');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('An error occurred while deleting the user.');
    });
});


// READ - Get all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error('Error fetching movies: ', err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Get movie by title
app.get('/movies/:title', (req, res) =>{
  const { title } = req.params;
  Movies.findOne({ Title: title })
  .then((movie) => {
    if (movie){
      res.status(200).json(movie);
    } else{
      res.status(404).send('No such movie found');
    }
  })

  .catch((err) =>{
    console.error(`Error fetching movie with title "${title}": `, err);
    res.status(500).send('Error: ' + err);
  });

});


// READ a specific genre by genre name
app.get('/movies/genre/:genreName', async (req, res) => {
  const { genreName } = req.params;

  try {
    // Find a movie that matches the genre name
    const movie = await Movies.findOne({ 'Genre.Name': genreName });

    if (movie && movie.Genre) {
      // If a movie is found, return the genre
      res.status(200).json(movie.Genre);
    } else {
      // If no movie with that genre is found
      res.status(400).send('No such genre');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});


// READ a specific director by director name
app.get('/movies/directors/:directorName', async (req, res) => {
  const { directorName } = req.params;

  try {
    // Find a movie with the specified director's name
    const movie = await Movies.findOne({ 'Director.Name': directorName });

    if (movie && movie.Director) {
      // If a movie with the director is found, return the director's details
      res.status(200).json(movie.Director);
    } else {
      // If no movie with that director is found
      res.status(400).send('No such director');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});



// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Delete a user by user
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



// passport app
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // CONDITION TO CHECK ADDED HERE
  if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
  }
  // CONDITION ENDS
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
      }
  },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error: ' + err);
      })
});


// adding new users including a password
app.post('/users', async (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) 
  // Search to see if a user with the reqeusted username already eosts 
  .then((user) => {
    if (user){
      // If the user is found, send a response that it already exists
      return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
        .create({
          Username :req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday:req.body.Birthday
        })
        .then((user) => {res.status(201).json(user)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
      }
})
.catch((error) => {
  console.error(error);
  res.status(500).send('Error: ' + error);
  });
});


app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email','Email does not appear to be valid').isEmail()], async (req, res) => {
      // check the validation object for errors
      let errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(422).json({ errors:errors.array()});
      }

      let hashedPassword = Models.Users.hashPassword(req.body.Password);
      await Users.findOne({ Username: req.body.Username}) 
      // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user){
          // If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username +'already exists');
        } else {
          Users
          .create({
            Username:req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday:req.body.Birthday
          })
          .then((user) => {res.status(201).json(user)})
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' +error);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error:' + error);
      });
    });
  




// mongoose.connect('mongodb://localhost:27017/myFlixDB', 
//   { useNewUrlParser: true, useUnifiedTopology: true });


// app.listen(8080, () => console.log("Listening on port 8080"))
// replace app.listen(8080
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});