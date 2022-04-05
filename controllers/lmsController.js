require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const errorHandler = (err)=>{
    console.log(err.message,err.code);
    let errors = {email:'',password:''};

    if (err.message === 'incorrect email'){
        errors.email = 'That email is not registered'
    }
    if (err.message === 'incorrect password'){
        errors.password = 'That password is incorrect'
    }
    if (err.code === 11000){
        errors.email = 'That email is already registered'
        return errors;
    }

    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message
        });
    }

    return errors;
}

const maxAge = 5*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},process.env.SECRET,{
        expiresIn:maxAge
    });
};

const signup_get = (req,res)=>{
    res.render('signup',{errors:null});
}
const login_get = (req,res)=>{
    res.render('login');
}
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
      cb(null,file.fieldname + '-' + Date.now())
    }
});

const login_post = async(req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json({user:user._id});
    }
    catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});  
    }
}



const logout = (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
}
module.exports = {
    signup_get,
    login_get,
    errorHandler,
    login_post,
    logout
}

