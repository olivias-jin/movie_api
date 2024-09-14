const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

// mongoose
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors : [String],
    ImagePath: String,
    Featured: Boolean
});

let useScheme = mongoose.Schema({
    Username: { type: String, required: true},
    Password: { type: String, required: true},
    Email: { type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});


// bcrypt
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref:'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methids.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', useScheme);

module.exports.Movie = Movie;
module.exports.User = User;