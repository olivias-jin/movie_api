const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cdDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
morgan = require('morgan'),
fs =require('fs'),
path = require('path');

const app = express();

app.use(express.static('public'));


let topMovies = [
    {
        title:'Forrest Gump',
        director: 'Robert Zemeckis'
    },
    {
        title:'Spirited Away',
        director: 'Hayao Miyazaki'
    },
    {
        title:'Wall E',
        director: 'Andrew Stanton'
    },

    {
        title:'Toy Story',
        director:'John Lasseter'
    },

    {
        title:'3 Idiots',
        director: ' Rajkumar Hirani'
    },

    {
        title:'Up',
        director: 'Pete Docter & Bob Peterson'
    },
    {
        title: 'The Sixth Sense',
        director:'M. Night Shyamalan'
    },
    {
        title:'Hacksaw Ridge',
        director: 'Mel Gibson'
    },
    {
        title:'Monsters, Inc',
        director:'Pete Docter & David Silverman & Lee Unkrich'
    },
    {
        title:'The Truman Show',
        director: 'Peter Weir'
    }
];

//in order to be able  to write the logs to the log.txt, needs the accesslogstream
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


//GET Requests
app.get('/', (req,res) => {
    res.send('Welcome to my movie club!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});


app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
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
          return res.status(400).send(req.body.Username + 'already exists');
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