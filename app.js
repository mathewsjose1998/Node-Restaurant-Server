var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose=require('mongoose')

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
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
app.use(cookieParser('secret'));

const auth=(req,res,next)=>{
  
  console.log(req.signedCookies)
  if(!req.signedCookies.user){

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

          if(username==='admin'&& password==='password'){
            res.cookie('user','admin',{signed:true})
            next();
          }
          else{
            var err=new Error(" not authorised")

            res.setHeader("WWW-Authenticate",'Basic');
            res.status=401;
            return next(err)
          }
        }
        else{
          if(req.signedCookies.user==='admin'){
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
