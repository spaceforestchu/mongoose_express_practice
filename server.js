var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config();

mongoose.connect('mongodb://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@ds155150.mlab.com:55150/mongobasic', function(err){
  if (err) {
    console.log(err);
  }
  console.log('connected to the database');
});

var UserSchema = new mongoose.Schema({
  name: String,
  age: Number
});


UserSchema.methods.addLastName = function(lastName) {
  this.name = this.name + ' ' + lastName;
  return this.name
}


var User = mongoose.model('User', UserSchema);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/:id', function(req, res, next){
  User.findById({_id: req.params.id}, function(err, foundUser){
    foundUser.addLastName('HamsterMaru');
    foundUser.save(function(err){
      if(err){
        console.log(err);
      }
      res.json(foundUser);
    })
  })
});

app.post('/createuser', function(req, res, next){
  var user = new User();
  user.name = req.body.name;
  user.age = req.body.age;
  user.save(function(err){
    if(err){
      console.log(err);
    }
    res.json(user);
  });
});

app.listen(3000, function(err) {
  if(err){
    console.log(err);
  } else {
    console.log('Server Running on Port 3000');
  }
})
