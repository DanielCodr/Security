//jshint esversion:6
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require('mongoose');
//lvl 2: const encrypt = require("mongoose-encryption");
//lvl 3: const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10
 
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


//For level 2
//userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});



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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User ({
            email:req.body.username,
            password:hash
        })
        newUser.save()
        .then(()=>{
            res.render("secrets");
        })
        .catch((err)=>{
            console.log(err);
        })
    });

    /* lvl 3: const newUser = new User ({
        email:req.body.username,
        password:md5(req.body.password)
    })
    newUser.save()
    .then(()=>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    })*/
});

app.post("/login", (req,res)=>{
    const username = req.body.username;
    //lvl 3: const password = md5(req.body.password);
    const password = req.body.password;

    User.findOne({email:username})
    .then((foundUser)=>{
            bcrypt.compare(password, foundUser.password, function(err, result) {
                // result == true
                if (result == true){
                res.render("secrets");
                }
            });
            
        
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.listen(port, ()=>{
    console.log('Server started on port' + port);
});