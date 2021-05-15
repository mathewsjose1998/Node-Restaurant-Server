var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose=require('mongoose')
var session =require('express-session')
var FileStore = require('session-file-store')(session)

var indexRouter = require("./routes/users");
var usersRouter = require("./routes/index");
var dishRouter = require("./routes/dishesRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookies and basic authentication
//app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name:'session_id',
  secret:'12345-67890-09876-54321',
  saveUninitialized:false,
  resave:false,
  store:new FileStore()
}))

app.use("/", indexRouter);
app.use("/users", usersRouter);

const auth=(req,res,next)=>{
  
 
  if(!req.session.user){
            var err=new Error("  not authorised go to /login or /signup")

    
            err.status=401;
            return next(err)
  }
          

        
      else{
        if(req.session.user==='authorised'){
          next();
        }
        else{
          var err=new Error(" not authorised")

          
          return next(err)
        }
      }

  }
  
app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dish", dishRouter);
app.use("/promo", promoRouter);
app.use("/leader", leaderRouter);

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


const mongoAtlasUri="mongodb+srv://mathews_pwj:lvzHx2XBFOnYchQ2@cluster0.9tyvt.mongodb.net/nodemongo?retryWrites=true&w=majority"


    // Connect to the MongoDB cluster
     mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },)

      .then(()=>{
        console.log('conected')
      })


 

module.exports = app;
