var _ = require("lodash");
var signToken = require("../../auth/auth").signToken;

exports.createUser = (req, res) => {
  console.log("You hit the signup Route");
  //import model
  var User = require("../user/userModel");

  //instance of model
  var newUser = new User();

  //grab data and destructure if needed
  var data = req.body;

  //use lodash to write object properties into newUser
  _.assign(newUser, data);

  //save to mongo db
  newUser.save(function(err, newUser) {
    if (err) {
      return res.json({ err: err.message})
    }
    else {
      var token = `Bearer ${signToken(newUser._id)}`;
      return res.json({ token: token });
    }  
  });
};

exports.root = (req, res) => {
  res.send('Sign Up Root');
};
