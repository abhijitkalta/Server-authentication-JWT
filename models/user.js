const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true
  },
  password: String
});

//on save hook, hash the password
userSchema.pre('save', function(next){
  //get access to the user model
  const user = this;
  const saltRounds = 10;

  //generate a salt and run callback
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if(err){
      return next(err);
    };

    //encrypt the password using the hash
    bcrypt.hash(user.password, salt, function(err, hash) {
        // Store hash in your password DB.
        if(err){
          return next(err);
        } ;

        //overwrite password with hash
        user.password = hash;
        next();
    });
});
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      return callback(err);
    }
    else {
      return callback(null, isMatch);
    }
  })
}

const User = mongoose.model('User', userSchema);

module.exports = User;
