//jshint esversion:6
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
 
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://0.0.0.0:27017/userDB');

}
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


const userSchema = new mongoose.Schema({
    email:String,
    password:String
});



userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});



const User = new mongoose.model("User", userSchema);




app.get("/", (req,res)=>{
    res.render("home")
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.post("/register", (req,res)=>{
    const newUser = new User ({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save()
    .then(()=>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.post("/login", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username})
    .then((foundUsesr)=>{
        if (foundUsesr.password === password){
            res.render("secrets");
        } 
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.listen(port, ()=>{
    console.log('Server started on port' + port);
});