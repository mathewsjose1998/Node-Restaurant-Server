var express = require('express');
const { Error } = require('mongoose');
var router = express.Router();
var User=require('../models/user')
var session =require('express-session')
var FileStore = require('session-file-store')(session)
var passport=require('passport');
var authenticate=require('../authenticate')


router.use(express.json())

/* GET home page. */
router.get('/', authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next)=> {

  User.find({})

  .then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })

 // res.render('index', { title: 'Express' });
});

router.post('/signup',(req,res,next)=>{
  
  User.register(new User({username:req.body.username}),
  req.body.password,(err,user)=>{
    if(err){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json')
      res.json({err:err})
    }
    else{
      if(req.body.firstname){
        user.firstname=req.body.firstname
      }
      if(req.body.lastname){
        user.firstname=req.body.lastname
      }
      user.save((err,user)=>{
        if(err){
          res.statusCode=500;
          res.setHeader('Content-Type','application/json')
          res.json({err:err})
          return;
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json')
          res.json( {success:true, staus:'registration succesfull',user:user})
          })
      })
    
     }
  })
})
  


  router.post('/login',passport.authenticate('local'),(req,res)=>{
    console.log(req.user)
    var token=authenticate.getToken({_id:req.user._id})
    res.statusCode=200;
    res.setHeader('Content-Type','application/json')
    res.json( {success:true,token:token, status:'you are succesfully logged in'})
 
  })

  router.get('/logout',(req,res)=>{
    if(req.session){
      req.session.destroy();
      res.clearCookie('session_id');
      res.redirect('/');
    }
    else{
      var err=new Error(" you are not logged in")
      err.status=403;
      next(err);
    }
  })

module.exports = router;
