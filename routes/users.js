const express=require('express');
const router= express.Router();
const bcrypt= require('bcryptjs');
const passport= require('passport')
const User= require('../models/User');
const local=require('passport-local');

router.get('/login',function(req,res){
  res.render('../views/users/login');
})

router.get('/register',function(req,res){
  res.render('../views/users/register');
});

//login post

router.post('/login',function(req,res,next){
passport.authenticate('local', {
successRedirect:'/ideas',
failureRedirect:'/users/login',
failureFlash:true
})(req,res,next);
});

//logout
router.get('/logout',function(req,res){
  req.logout();
  req.flash('success_msg','You have successfully logged out');
  res.redirect('/users/login');
})

// register form
router.post('/register',function(req,res){
console.log(req.body);
let errors=[];
if(req.body.password != req.body.password2){
errors.push({text:"Your passord doesn't match"});
}

if(req.body.password.length<4){
errors.push({text:"Length should be more than 4"});
}

if( errors.length>0){
res.render('users/register',{
errors:errors,
name:req.body.name,
email:req.body.email,
password:req.body.password,
password2:req.body.password2});
}
else{
User.findOne({email:req.body.email})
.then(function(user){
    if(user){
req.flash('error_msg','This email is already registered');
res.redirect('/users/login')
}
else{
 const newuser={
name:req.body.name,
email:req.body.email,
password:req.body.password
}
bcrypt.genSalt(10,function(err,salt){
bcrypt.hash(newuser.password,salt,function(err,hash){
if(err) throw err;
newuser.password=hash;
User(newuser).save()
.then(function(user){
req.flash('success_msg','You are now  registered and u can login');
res.redirect('/users/login');
})
.catch(function(err){
console.log(err);
})
});
});
}
})


}
});

module.exports= router;
