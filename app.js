require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const lmsRoutes = require('./routes/lmsRoutes')
const taskRoutes = require('./routes/taskRoutes')
const cookieParser = require('cookie-parser');
const { checkUser, auth } = require('./middleware');
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken');
const {errorHandler} = require('./controllers/lmsController')
const User = require('./models/User');

const app = express()

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())

app.use(cookieParser());

app.set('view engine','ejs');

const dbURI = process.env.DB_URI

mongoose.connect(dbURI)
    .then((result)=>app.listen(process.env.PORT || 5000))
    .catch((err)=>console.log(err))

app.get('*',checkUser);    
app.get('/',(req,res)=> res.render('index'));
app.get('/coursework',auth,(req,res)=>res.render('coursework'));
app.get('/coursework2',auth,(req,res)=>res.render('coursework2'));
app.get('/coursework3',auth,(req,res)=>res.render('coursework3'));
app.get('/dashboard', (req, res) => {
    res.redirect('/tasks');
});
  


const maxAge = 5*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},'sanket secret',{
        expiresIn:maxAge
    });
};

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
      cb(null,file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({storage:storage});
app.post('/signup',upload.single('image'),async(req,res,next)=>{
    console.log(req.file)
    const details = {
        email:req.body.email,
        password:req.body.password,
        username:req.body.username,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    //const {email,password,username,img} = req.body
    console.log(details)
    try{
        const user = await User.create(details)//({email,password,username,img});//
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        //res.json({user:user._id});
        res.render('coursework',{user:user})
    }
    catch(err){
        const errors = errorHandler(err);
        res.render('signup',{errors});
    }
})
  
app.use('/tasks', taskRoutes);
app.use(lmsRoutes);
  
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});


