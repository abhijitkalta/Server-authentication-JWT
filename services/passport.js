const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config');

//setup options for local-strategy
const localOptions = {
  usernameField: 'email'
};

//setup options for jwt-strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //verify the username and password, if true call done with user, if flase call sone with false
  User.findOne({
    email: email
  }, function(err, user){
    if(err){
      done(err, false);
    }
    if(!user){
      done(null, false);
    }

    user.comparePassword(password, function(err, isMatch){
      if(err){
        return done(err);
      };
      if(!isMatch){
        return done(null, false);
      };
      return done(null, user);
    })
  })
});

//JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //see if the user id in the payload exists in our database. If it exists call done with the user, or else call done with blank
  User.findById(payload.sub, function(err, user){
    if(err){
      done(err, false);
    };
    if(user){
      done(null, user);
    }else {
      done(null, false);
    };
  })
});

passport.use(jwtLogin);
passport.use(localLogin);
