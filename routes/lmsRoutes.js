const { Router } = require('express');
const User = require('../models/User');
const lmsController = require('../controllers/lmsController');
const { auth } = require('../middleware')
const bcrypt = require('bcrypt');

const router = Router();

router.get('/signup', lmsController.signup_get);
router.get('/login', lmsController.login_get);
router.post('/login', lmsController.login_post);
router.get('/logout', lmsController.logout);

router.get('/profile/:id',(req, res) => {
    const id = req.params.id;
    console.log(id)
    User.findById(id)
      .then(result => {
      //console.log(result)
      res.render('profile', { user: result});
      })
      .catch(err => {
      console.log(err);
    });
});

router.post('/profile/:id', async(req,res)=>{
  const salt = await bcrypt.genSalt()
  const id=req.params.id
  //console.log(id)
  console.log(req.body)
  const password = req.body.password
  const newpass = await bcrypt.hash(password,salt)
  var newquery = {$set:{username:req.body.username,
    email:req.body.email,
    password:newpass}};
  console.log(newquery)
  User.findByIdAndUpdate(id,newquery)
    .then(result=>{
      res.redirect('/coursework');
    })
    .catch(err=>{
      console.log(err);
    })
})

module.exports = router;