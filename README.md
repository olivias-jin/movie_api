# movie_api
The Movie API is API designed for movie lovers. It provides detailed information about movies, genres, and directors. Users can register, update their profile and manage their list of favorite movies. 

## Table of Contents
1. [Project Feature](#project-feature)
2. [Api Endpoint](#api-endpoints)
3. [Technologies Used](#techonologies-used)

## Project Feature
- Return a list of ALL movies to the user.
- Return data about a single movie (description, genre, director, image URL, whether it’s featured or not) by title.
- Return data about a genre (description) by name (e.g., "Thriller").
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register with a username, password, email, and date of birth.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add movies to their list of favorites.
- Allow users to remove movies from their list of favorites.
- Allow existing users to deregister from the service.

## API Endpoints
Movies 
- Get All Movies: get('/movies',)
- Get Moives By Title: get('/movies/:title',)
- Get Movies by Genre: get('/movies/genre/:name',)
- Get Director's details by Name: get('/movies/directors/:name',)

Users
- Create User: post('/users',)
- Get All Users: get('/users')
- Get Users by Username: get('/users/:username',)
- Update Users by Username: put('/users/:username',)
- Add movie to favorites: post('/users/:username/movies/:title',)
- Remove movie to favorites: delete('/users/:username/movies/:title',)
- Delete Users: delete('/users/:username',)

## Techonologies Used
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose for modeling)
- Authentication: JWT (JSON Web Tokens) & Passport.js for securing endpoints

