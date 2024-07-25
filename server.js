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
    id: 1,
    name: "Vic",
    favoriteMovies: []
  }
];


let movies:[
  {
    "Title":"Forrest Gump",
    "Description": "a mentally challenged man with an IQ of 75 who plays an accidental role in some of the most significant events of the 20th century.",
    "Genre": {
      "Name":"Drama"
    },
    "Director": {
      "Name":"Robert Zemeckis",}
      
    "imageURL": "https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i"
  "feature":True
  },

{
    "Title":"Spirited Away",
    "Director": "Hayao Miyazaki"
},
{
    "Title":'Wall E',
    "Director": 'Andrew Stanton'
},

{
    "Title":'Toy Story',
    "Director":'John Lasseter'
},

{
    "Title":'3 Idiots',
    "Director": ' Rajkumar Hirani'
},

{
    "Title":'Up',
    "Director": 'Pete Docter & Bob Peterson'
},
{
    "Title": 'The Sixth Sense',
    "Director":'M. Night Shyamalan'
},
{
    "Title":'Hacksaw Ridge',
    "Director": 'Mel Gibson'
},
{
    "Title":'Monsters, Inc',
    "Director":'Pete Docter & David Silverman & Lee Unkrich'
},
{
    "Title":'The Truman Show',
    "Director": 'Peter Weir'
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
  const { directorsName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;

  if (director){
    res.status(200).json(director);
  } else{
    res.status(400).send('no such director')
  }
})

app.listen(8080, () => console.log("listeing on 8080"))

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