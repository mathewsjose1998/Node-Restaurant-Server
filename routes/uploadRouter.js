const express = require("express");
const multer=require('multer')
var authenticate=require('../authenticate')
const uploadRouter = express.Router();

uploadRouter.use(express.json());


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }

})

const imageFileFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
       return cb(new Error ('you can only upload image files'))
    }
    else{
        cb(null,true)
    }
}

const upload=multer({storage:storage,fileFilter:imageFileFilter})

uploadRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
    res.status(403).send("put operation is not supporded on /dishes");
   
  })
  .post(authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'),(req, res) => {
            
    res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(req.file);

  })

  .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
    res.status(403).send("put operation is not supporded on /dishes");
   
  })
  .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
    res.status(403).send("put operation is not supporded on /dishes");
   
  })




module.exports=uploadRouter;

