const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const path = require('path')

var date = Date.now()
var name= `image-${date}.png`

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlength:[5,'Minimum password length is 5 characters'],
    },
    username:{
        type:String,
        required:[true,'Please enter an username'],
        unique:true
    },
    img:{
        data:Buffer,
        contentType:String
    }
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({ email })
    if(user){
        const verify = await bcrypt.compare(password,user.password);
        if (verify){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user',userSchema);
module.exports = User;