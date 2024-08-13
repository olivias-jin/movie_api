const jwtSecret = 'your_jwt_secret';// This has to be the same key used in the JWTStrategy

const jwt = require('jasonwebtoken'),
passport= require('passport');

require('./passport');// Your local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret,{
        usbject: user.Username,  // This is the username you’re encoding in the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
    });
}

/*POST login.*/
module.exports = (router) => {
    router.post('/login', (req,res)=> {
        passport.authenticate('local', {session:false}, (error, user, info)
        => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                user:user
            });
            }
            req.login(user,{session:false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token});
            });
        })(req, res);
    });
}

app.get('/movies', passport.authenticate('jwt', {session: false}), async(req, res)=> {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' +error);
    });
});