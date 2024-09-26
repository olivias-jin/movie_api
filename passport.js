const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      try {
        const user = await Users.findOne({ Username: username });
        if (!user) {
          return callback(null, false, { message: 'Incorrect username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
          return callback(null, false, { message: 'Incorrect username or password.' });
        }

        return callback(null, user);
      } catch (error) {
        return callback(error);
      }
    }
  )
);

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'default_secret'
}, async (jwtPayload, callback) => {
  try {
    const user = await Users.findById(jwtPayload._id);
    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
}));

// // add user
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'Username',
//       passwordField: 'Password',
//     },
//     async (username, password, callback) => {
//       console.log(`${username} ${password}`);
//       await Users.findOne({ Username: username})
//       .then((user)=>{
//         if (!user) {
//           console.log('incorret username');
//           return callback(null, false, {
//             message: 'Incorrect username or passsword.',
//           });
//         }
//         if (!user.validatePassword(password)) {
//           console.log('incorret password');
//           return callback(null, false, {message: 'Incorrect password.'});
//         }
//         console.log('finished');
//         return callback(null, user);
//       })
//       .catch((error) => {
//         if(error){
//           console.log(error);
//           return callback(error);
//         }
//       })
//     }
//   )
// );