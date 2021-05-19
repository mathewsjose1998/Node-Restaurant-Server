var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose=require('mongoose')
var session =require('express-session')
var FileStore = require('session-file-store')(session)

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishesRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");
var uploadRouter = require("./routes/uploadRouter");
var passport=require('passport')
var authenticate=require('./authenticate')
var config=require('./config')

var app = express();

// app.all('*',(req,res,next)=>{
//   if(req.secure){
//       return next()
//   }
//   else{
//     res.redirect(307,`https://${req.hostname}:${app.get('secPort')}${req.url}`)
//   }
// })

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookies and basic authentication
//app.use(cookieParser('12345-67890-09876-54321'));
            //session not used in token based auth so commented
// app.use(session({
//   name:'session_id',
//   secret:'12345-67890-09876-54321',
//   saveUninitialized:false,
//   resave:false,
//   store:new FileStore()
// }))

app.use(passport.initialize());
//app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

                          //auth function not neeeded on token based appropach
// const auth=(req,res,next)=>{
  
 
//   if(!req.user){
//      var err=new Error("  not authorised go to /login or /signup")
//     err.status=403;
//     return next(err)
//   }
//   else{
//   next();     

//   }
// }
  
//app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dish", dishRouter);
app.use("/promo", promoRouter);
app.use("/leader", leaderRouter);
app.use("/imageupload", uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  //res.status(err.status || 500);
  res.render("error");
});

//mongodb+srv://mathews_pwj:lvzHx2XBFOnYchQ2@cluster0.9tyvt.mongodb.net/nodemongo?retryWrites=true&w=majority"

const mongoAtlasUri=config.mongoUrl;


    // Connect to the MongoDB cluster
     mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },)

      .then(()=>{
        console.log('conected')
      })


 

module.exports = app;
