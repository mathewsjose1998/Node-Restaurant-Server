const express = require("express");
var mongoose=require('mongoose');
const { findOneAndUpdate, findByIdAndUpdate } = require("../models/dishes");
const dishRouter = express.Router();
var Dishes=require('../models/dishes')

dishRouter.use(express.json());

dishRouter
  .route("/")

  .get((req, res) => {
      Dishes.find({},( err,dishes)=>{
        if(err) console.log(err)

        res.status(200).send(dishes)

      })
      
  })

  .post((req, res) => {
    // res.send(`add ${req.body.name} and ${req.body.desc} to a new dishes`);
    Dishes.create( req.body,(err,dish)=>{
  if(err) console.log(err)

        res.status(200).send(dish)

      })
})

  .put((req, res) => {
    res.status(403).send("put operation is not supporded on /dishes");
   
  })
  .delete((req, res) => {
  
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
    .then((dish)=>{
      res.status(200).send(dish)
    }).catch((err)=>{console.log(err)})
  })
  .post((req, res) => {
    res
      .status(403)
      .send(`post operation is not done on /dishes/${req.params.dishId}`);
  })
  .put((req, res) => {
    // res.send(`add ${req.body.name} to ${req.params.dishId}`);
    Dishes.findByIdAndUpdate(req.params.dishId,{$set:req.body },{new:true}).exec()
    .then((dish)=>{
      res.status(200).send(dish)
    })
    .catch((err)=>console.log(err))
  })
  .delete((req, res) => {
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
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            dish.comments.push(req.body);
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
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete((req, res, next) => {
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
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
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
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
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
    }, (err) => next(err))
    .catch((err) => next(err));
});
  


module.exports = dishRouter;
