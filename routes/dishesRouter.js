const express = require("express");
var mongoose=require('mongoose');

const dishRouter = express.Router();
var Dishes=require('../models/dishes')
var authenticate=require('../authenticate')

dishRouter.use(express.json());

dishRouter
  .route("/")
 .get((req, res) => {
      Dishes.find({})
      .populate('comments.author')
      .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);

      },(err)=> console.log(err))
      .catch((err)=>console.log(err));
      
  })

  .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
    // res.send(`add ${req.body.name} and ${req.body.desc} to a new dishes`);
    Dishes.create( req.body,(err,dish)=>{
  if(err) console.log(err)

        res.status(200).send(dish)

      })
})

  .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
    res.status(403).send("put operation is not supporded on /dishes");
   
  })
  .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
  
    Dishes.remove({})
    .then(()=>{
      res.send("delete all dishes ");
    })
    
  });

dishRouter
  .route("/:dishId")
  .get((req, res) => {
    // res.status(200).send(`get the dish with id ${req.params.dishId}`);
    Dishes.findOne({_id:req.params.dishId})
    .populate('comments.author')
    .then((dish)=>{
      res.status(200).send(dish)
    }).catch((err)=>{console.log(err)})
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res,next) => {
     
    
    res
      .status(403)
      .send(`post operation is not done on /dishes/${req.params.dishId}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
    
    // res.send(`add ${req.body.name} to ${req.params.dishId}`);
    Dishes.findByIdAndUpdate(req.params.dishId,{$set:req.body },{new:true}).exec()
    .then((dish)=>{
      res.status(200).send(dish)
    })
    .catch((err)=>console.log(err))
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
   
    // res.send(`delete the dish with id : ${req.params.dishId}`);
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((dish)=>{
      res.send(dish)
    }).catch((err)=>{console.log(err)})

  });

  //comment

  dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            req.body.author=req.user._id
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                          res.json(dish);       
                    })
                         
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req, res, next) => {

    Dishes.findById(req.params.dishId)
    .then((dish) => {
          let authorId=dish.comments.id(req.params.commentId).author._id;
       
     if(authorId.equals(req.user._id)){
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.review) {
                    dish.comments.id(req.params.commentId).review = req.body.review;                
                }
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);    
                        })
                            
                }, (err) => next(err));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
     }
     else{
        err = new Error(`${req.user.username} is not alowed to edit this comment`);
        err.status = 404;
        return next(err);    
     }
    
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        let authorId=dish.comments.id(req.params.commentId).author._id;
        if(authorId.equals(req.user._id)){
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);    
                        })               
                    }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);            
                }
    }
    else{
        err = new Error(`${req.user.username} is not alowed to edit this comment`);
        err.status = 404;
        return next(err);    
     }
    
    }, (err) => next(err))
    .catch((err) => next(err));
});
  


module.exports = dishRouter;
