// const mongoose = require('mongoose');
// const Models = require('./models.js');

// const Movies = Models.Movie;
// const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });



const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
uuid = require('uuid');

app.use(bodyParser.json());


let users= [
  {
    id: 1,
    name: "Jin",
    favoriteMovies: []
  },

  {
    id: 2,
    name: "Vic",
    favoriteMovies: ["Forrest Gump"]
  }
];

let movies = [
  {
    "Title": "Forrest Gump",
    "Description": "a mentally challenged man with an IQ of 75 who plays an accidental role in some of the most significant events of the 20th century.",
    "Genre": {
      "Name": "Drama"
    },
    "Director": {
      "Name": "Robert Zemeckis",
      "Bio": "",
      "Birth": "1952"
    },
    "imageURL": "https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "Spirited Away",
    "Description": "Chihiro's journey to save her parents and how it represents her transition into adulthood.",
    "Genre": {
      "Name": "Animation"
    },
    "Director": {
      "Name": "Hayao Miyazaki",
      "Bio": "",
      "Birth": "1963"
    },
    "imageURL": "https://www.imdb.com/title/tt0245429/mediaviewer/rm4207852801/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "Wall E",
    "Description": "The last robot left on Earth, programmed to clean up the planet, one trash cube at a time.",
    "Genre": {
      "Name": "Animation"
    },
    "Director": {
      "Name": "Andrew Stanton",
      "Bio": "",
      "Birth": "1965"
    },
    "imageURL": "https://www.imdb.com/title/tt0910970/mediaviewer/rm1659211008/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "Toy Story",
    "Description": "Taking place in a world where toys come to life when humans are not present, the plot of Toy Story focuses on the relationship between an old-fashioned pullstring cowboy doll named Woody and a modern space cadet action figure, Buzz Lightyear, as Woody develops jealousy towards Buzz when he becomes their owner Andy's favorite toy.",
    "Genre": {
      "Name": "Animation"
    },
    "Director": {
      "Name": "John Lasseter",
      "Bio": "",
      "Birth": "1957"
    },
    "imageURL": "https://www.imdb.com/title/tt0114709/mediaviewer/rm3813007616/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "3 Idiots",
    "Description": "follows college best friends, Farhan (R. Madhavan) and Raju (Sharman Joshi), who drive down to Shimla in search for Rancho (Aamir Khan), their long-lost buddy.",
    "Genre": {
      "Name": "Comedy"
    },
    "Director": {
      "Name": "Rajkumar Hirani",
      "Bio": "",
      "Birth": "1962"
    },
    "imageURL": "https://www.imdb.com/title/tt1187043/mediaviewer/rm2029391104/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "Up",
    "Description": "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway.",
    "Genre": {
      "Name": "Animation"
    },
    "Director": {
      "Name": "Pete Docter & Bob Peterson",
      "Bio": "",
      "Birth": "1968 & 1961"
    },
    "imageURL": "https://www.imdb.com/title/tt1049413/mediaviewer/rm3826338560/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "The Sixth Sense",
    "Description": "Young Cole Sear (Haley Joel Osment) is haunted by a dark secret: he is visited by ghosts. Cole is frightened by visitations from those with unresolved problems who appear from the shadows. He is too afraid to tell anyone about his anguish, except child psychologist Dr. Malcolm Crowe (Bruce Willis).",
    "Genre": {
      "Name": "Psychological thriller"
    },
    "Director": {
      "Name": "M. Night Shyamalan",
      "Bio": "",
      "Birth": "1970"
    },
    "imageURL": "https://www.imdb.com/title/tt0167404/mediaviewer/rm2099059456/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "Hacksaw Ridge",
    "Description": "An intense and gripping war drama that tells the inspiring true story of Desmond Doss, a conscientious objector who served as a medic during World War II.",
    "Genre": {
      "Name": "War"
    },
    "Director": {
      "Name": "Mel Gibson",
      "Bio": "",
      "Birth": "1956"
    },
    "imageURL": "https://www.imdb.com/title/tt2119532/mediaviewer/rm2660241152/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "Monsters, Inc",
    "Description": "The city of Monstropolis in a world entirely populated by monsters is powered by energy from the screams of human children. At the Monsters, Inc., factory, skilled monsters employed as 'scarers' venture into the human world to scare children and harvest their screams, through doors that activate portals to children's bedroom closets.",
    "Genre": {
      "Name": "Animation"
    },
    "Director": {
      "Name": "Pete Docter & David Silverman & Lee Unkrich",
      "Bio": "",
      "Birth": "1968 & 1957 & 1967"
    },
    "imageURL": "https://www.imdb.com/title/tt0198781/mediaviewer/rm2785401856/?ref_=tt_ov_i",
    "feature": true
  },
  {
    "Title": "The Truman Show",
    "Description": "An insurance salesman is oblivious of the fact that his entire life is a TV show and his family members are mere actors.",
    "Genre": {
      "Name": "Comedy drama"
    },
    "Director": {
      "Name": "Peter Weir",
      "Bio": "",
      "Birth": "1944"
    },
    "imageURL": "https://www.imdb.com/title/tt0120382/mediaviewer/rm1927354112/?ref_=tt_ov_i",
    "feature": true
  }
];



//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }

});

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else{
    res.status(400).send('no such user')
  }

})

//UPDATE
app.put('/users/:id/:movieTitle', (req, res) => {
  const { favoriteMovies } = req.params;
  const updatedmovie = req.body;

  let user = users.find( user => user.favoriteMovies == favoriteMovies);

  if (user) {
    user.favoriteMovies = updatedmovie.name;
    res.status(200).json(user);
  } else{
    res.status(400).send('no such movieTitle')
  }

})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(`${movieTitle} has been added to user ${id}'s array`);
  } else{
    res.status(400).send('no such user')
  }

})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).json(`${movieTitle} has been removed from user ${id}'s array`);;
  } else{
    res.status(400).send('no such user')
  }

})


//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    user = users.filter(user => user.id != id);
    res.json(users)
    ///res.status(200).send(`user $(id) had been deleted`);;

  } else{
    res.status(400).send('no such user')
  }

})



// READ
app.get('/movies', (req, res) =>{
  res.status(200).json(movies);
})

// READ
app.get('/movies/:title', (req, res) =>{
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie){
    res.status(200).json(movie);
  } else{
    res.status(400).send('no such movie')
  }
})




// READ
app.get('/movies/genre/:genreName', (req, res) =>{
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

  if (genre){
    res.status(200).json(genre);
  } else{
    res.status(400).send('no such genre')
  }
})


// READ
app.get('/movies/directors/:directorName', (req, res) =>{
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;

  if (director){
    res.status(200).json(director);
  } else{
    res.status(400).send('no such director')
  }
})

app.listen(8000, () => console.log("listeing on 8000"))

// app.get('/',(request, response) => {
//   response.send('hello world')
// })

// app.listen(8080, () => console.log("listening on 8080"))

// const http = require('http'),
//   url = require('url');

// http.createServer((request, response) => {
//   let requestURL = url.parse(request.url, true);
//   if ( requestURL.pathname == '/documentation.html') {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Documentation on the movieclub API.\n');
//   } else {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Welcome to my movie club!\n');
//   }

// }).listen(8080);

// console.log('My first Node test server is running on Port 8080.');