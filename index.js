const express = require('express'),
morgan = require('morgan'),
fs =require('fs'),
path = require('path');

const app = express();



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


// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

//GET Requests
app.get('/', (req,res) => {
    res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use(express.static('public'));