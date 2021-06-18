var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy
var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken')
var FacebookTokenStrategy=require('passport-facebook-token')

var config=require('./config')

var User=require('./models/user')

//authenticate fun by momgoose local pasport
exports.local=passport.use(new LocalStrategy(User.authenticate()));
//invoked on authentication, and its job is to serialize the user instance with the information we pass on to it and store it in the session via a cookie. 
passport.serializeUser(User.serializeUser());
//invoked every subsequent request to deserialize the instance, providing it the unique cookie identifier as a “credential”.
passport.deserializeUser(User.deserializeUser());


// all done ol=nly in json web  token aythorisation . not in sesssion or cookie auth
exports.getToken=function(user){
    return jwt.sign(user,config.secretKey,
        {expiresIn:3600});
}

var opts={}
//get token from header
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;

//json webtoken passpoet strategy
exports.jwtPassport=passport.use(new JwtStrategy(opts,
(jwt_payload,done)=>{
    console.log(jwt_payload)
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err){
            return done(err,false)
        } 
        else if(user){
            return done(null,user)
        }
        else{
            //no user
            return done(null,false);
        }
    })
}))

//used to verify using the jwt statergy
exports.verifyUser=passport.authenticate('jwt',{session:false})

exports.verifyAdmin = function(req,res,next){
    if(req.user.admin){
        next();
    }
    else{
        var err=new Error("You are not authorized to perform this operation!");
        err.status=403;
        return next(err);
    }
}

exports.facebookPassport=passport.use(new 
    FacebookTokenStrategy({
            clientID:config.facebook.clientId,
            clientSecret:config.facebook.clientSecret

            },
            (accessToken,refreshToken,profile,done)=>{
                User.findOne({facebookId:profile.id},(err,user)=>{
                    if(err){
                        return done(err,false)
                    }
                    if(!err && user!==null){
                        return dome(null,user)
                    }
                    else{
                        user=new User({username:profile.displayName});
                        user.facebookId=profile.id;
                        user.firstname=profile.name.givenName
                        user.lastname=profile.name.familyName
                        user.save((err,user)=>{
                            if(err){
                                return done(err,false)
                            }
                            else{
                                return done(null,user)
                            }
                        })
                    }
                })
            }
))
