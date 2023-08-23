//jshint esversion:6
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//lvl 2: const encrypt = require("mongoose-encryption");
//lvl 3: const md5 = require("md5");
/*lvl 4:const bcrypt = require("bcrypt");
const saltRounds = 10*/
 
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://0.0.0.0:27017/userDB');

}
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

//For level 2
//userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});



const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req,res)=>{
    res.render("home")
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.get("/logout", function(req,res){
    req.logout(function(err){
        if(err){
            console.log(err)
        } else {
            res.redirect("/")
        }
    });

});

app.get("/secrets", function (req, res) {
    if (req.isAuthenticated()) {
      res.render("secrets");
    } else {
      res.redirect("/login");
    }
  });

  app.post("/register", function (req, res) {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/secrets");
          });
        }
      }
    );
  });

app.post("/login", (req,res)=>{
    const user = new User ({
        username: req.body.username,
        password:req.body.password
    })

    req.login(user, function (err){
        if (err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
              res.redirect("/secrets");
            });
        }
    })
})

app.listen(port, ()=>{
    console.log('Server started on port' + port);
});