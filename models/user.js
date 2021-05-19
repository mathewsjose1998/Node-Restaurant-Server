  var mongoose=require('mongoose')
  const {Schema}=mongoose;
  var passportLocalMongoose=require('passport-local-mongoose')

  const userSchema=new Schema({
     
    fisrtname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
      admin:{
          type:Boolean,
          default:false
      }
  })

  userSchema.plugin(passportLocalMongoose);

  module.exports=mongoose.model('User',userSchema);

  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGEzMTAzNTgzYWM3NzIzZDgyZTA0YzMiLCJpYXQiOjE2MjEyOTkzMDcsImV4cCI6MTYyMTMwMjkwN30.dmHw7H4jVri5OPzAsBGnX2xP0pxfVZctMSZnN8cK8wg

  //admin 3  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGEzNGJlNTk5MzlhYTU5MjA0OTFjYTAiLCJpYXQiOjE2MjEzMTQ3MDUsImV4cCI6MTYyMTMxODMwNX0.ycF1vqgRmmStgCAEjU5kcIi3B6BM_XVPAVjamJd5Xz8
  