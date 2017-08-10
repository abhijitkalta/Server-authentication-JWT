const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,     //subject
    iat: timestamp   //issued at time
  }, config.secret);
}

exports.signup = function(req, res, next){

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({
      error: 'Email and password required'
    });
  }

  User.findOne({
    email: email
  }, function(err, value){
    if(err){
      return next(err);
    };
    if(value){
      return res.status(422).send({
        error: 'Email is in use'
      });
    };

    const user = new User({
      email: email,
      password: password
    });

    user.save()
    .then((value) => {
      res.json({
        token: tokenForUser(user)
      });
    },(err) => {
      return err;
    })
  });
};

exports.signin = function(req, res, next){
  //email and password verified - only need to give them a token
  //since user is returned from passport
  res.send({
    token: tokenForUser(req.user)
  });
}
