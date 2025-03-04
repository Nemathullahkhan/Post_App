const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post")
const bcrypt = require("bcrypt");
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const jwt = require("jsonwebtoken");

app.get('/',(req,res)=>{
    res.render("index.ejs");
})
app.get('/profile',isLoggedin,(req,res)=>{
    console.log(req.user);
    res.send("Profile");
})
app.post("/register",async(req,res)=>{
    let {username, name,email,password,age} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(304).send("User already registered");

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let user = await userModel.create( {
                username,
                name,
                email,
                age,
                password: hash
            });

            let token = jwt.sign({email:email,userid:user._id},"secret_key")
            res.cookie("token",token);
            res.send("registered");
        })
    })
})

app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/login",async (req,res)=>{
    let {email,password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("Something went wrong"); 

    // passoword checking
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = jwt.sign({email:email,userid:user._id},"secret_key")
            res.cookie("token",token);
            res.status(200).send("You can login");
        }
        else res.redirect("/login")
    })
})

app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/login");
})

function isLoggedin(req,res,next){
    if(req.cookies.token==="") res.send("You must be logged in ");

    else{
        let data = jwt.verify(req.cookies.token,"secret_key");
        req.user = data;
        next();
    } 
}
app.listen(3000);