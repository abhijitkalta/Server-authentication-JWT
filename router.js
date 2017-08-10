const passport = require('passport');

const authController = require('./controllers/authController');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res){
    res.send({
      hii: 'there'
    });
  });
  app.post('/signin',requireSignIn, authController.signin);
  app.post('/signup', authController.signup);
}
