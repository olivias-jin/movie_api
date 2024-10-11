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
// let userSchema = mongoose.Schema({
//     Username: {type: String, required: true},
//     Password: {type: String, required: true},
//     Email: {type: String, required: true},
//     Birthday: Date,
//     FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref:'Movie'}]
// });

// userSchema.statics.hashPassword = (password) => {
//     return bcrypt.hashSync(password, 10);
// };

// userSchema.methods.validatePassword = function(password) {
//     return bcrypt.compareSync(password, this.Password);
// };


// let Movie = mongoose.model('Movie', movieSchema);
// let User = mongoose.model('User', useScheme);

// module.exports.Movie = Movie;
// module.exports.User = User;



const userSchema = new mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref:'Movie'}]
  });
  
  // This method will be used to compare the entered password with the hashed password stored in the database
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
  // // Pre-save hook to hash the password before saving it
  // userSchema.pre('save', async function(next) {
  //   const user = this;
  //   if (!user.isModified('Password')) return next();
  
  //   try {
  //     const salt = await bcrypt.genSalt(10);
  //     user.Password = await bcrypt.hash(user.Password, salt);
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // });
  
  const User = mongoose.model('User', userSchema);
  const Movie = mongoose.model('Movie', movieSchema);

  
  module.exports.User = User;
  module.exports.Movie = Movie;