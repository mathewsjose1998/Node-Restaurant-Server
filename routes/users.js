var express = require('express');
const { Error } = require('mongoose');
var router = express.Router();
var User=require('../models/user')
var session =require('express-session')
var FileStore = require('session-file-store')(session)


router.use(express.json())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("helooo")
 // res.render('index', { title: 'Express' });
});

router.post('/signup',(req,res,next)=>{
  console.log(req.body.username)
  User.findOne({username:req.body.username})
  .then((user)=>{
    if(user!=null){
      var err= new Error(`user ${req.body.username} already exists`)
      next(err)
    }
    else{
      return User.create({
        username:req.body.username,
        password:req.body.password
      })
    }
    

    })
    .then((user)=>{
      console.log(user)
      res.status(200).send("registered succesfully")
    })
.catch((err)=>next(err))
    

  })
  


  router.post('/login',(req,res,next)=>{

    if(!req.session.user){

      const authHeader=req.headers.authorization;

      if(!authHeader){
        var err=new Error("  not authorised")

        res.setHeader("WWW-Authenticate",'Basic');
        err.status=401;
        return next(err)
      }

      var auth=Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':')
      let username=auth[0];
      let password=auth[1];
      console.log(auth);

      User.findOne({username:username})
      .then((user)=>{
        if(user===null){
          var err=new Error(" not authorised")

          res.setHeader("WWW-Authenticate",'Basic');
          res.status=401;
          return next(err)
        }
        else if(user.password!=password){
          var err= new Error(`password is wrong`)
          next(err)
        }
        else if(user.username===username&& user.password===password){
          //  res.cookie('user','admin',{signed:true})
          req.session.user='authorised'  
          res.statusCode=200;
          res.setHeader('Content-Type','text/plain')
          res.end('you are authenticated')
          next();
          }
      })
      .catch((err)=>next(err))
       
    
    }

    else{
      res.statusCode=200;
      res.setHeader('Content-Type','text/plain')
      res.end('you are already authenticated')
    }

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
