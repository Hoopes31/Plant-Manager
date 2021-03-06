const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
});

//Add methods to your schema

UserSchema.pre("save", function(next) {
  //before saving a password we need to hash + salt
  if (!this.isModified("password")) return next();

  this.password = this.encryptPassword(this.password);
  next();
});

UserSchema.methods = {
  //check password on sign in
  authenticate: function(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  //hash the passwords
  encryptPassword: function(plainTextPassword) {
    if (!plainTextPassword) {
      return "";
    } else {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPassword, salt);
    }
  }
};

UserSchema.pre("save", function(next, done) {
  const User = mongoose.model('User', UserSchema)
  User.findOne({username: this.username}, function(err, result) {
    if(err) {
      done(err)
    }
    else if (result){
      done(new Error("Username is already in use"))
    }
    else {
      next()
    }
  })
})
module.exports = mongoose.model("user", UserSchema);
