const express = require("express");
var mongoose=require('mongoose');
const cors=require('./cors')

const favoritesRouter = express.Router();

var Favorites=require('../models/favorites')
var authenticate=require('../authenticate');
const favorites = require("../models/favorites");

favoritesRouter.use(express.json());


favoritesRouter
.route('/')
.get(authenticate.verifyUser,(req,res)=>{
    Favorites.find({})
    .populate('dishes')
    .populate('user')
    .then((fav)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
    },(err)=>console.log(err))
    .catch((err)=>console.log(err))

})
.post(authenticate.verifyUser,(req,res)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorites)=>{
        if(favorites){
            for (var i=0; i<req.body.length; i++) {
                if (favorites.dishes.indexOf(req.body[i]._id) === -1) {
                    favorites.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
        else{
            Favorites.create({"user":req.user._id,"dishes":req.body})
            .then((favorite)=>{
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);

            })
        }
    })
    .catch((err)=>console.log(err))
})
.put( authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(authenticate.verifyUser,(req,res)=>{
    Favorites.findOne({user:req.user.id})
    .then((favorite)=>{
        if(favorite){
            favorite.remove({})
            .then((fav)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);

            })
        }
        else{
            err = new Error('the user favorite doesnt exists  ');
            err.status = 403;
        }
    })
})

favoritesRouter
.route('/:dishId')

.get( authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})
.post( authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
            }
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": [req.params.dishId]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user.id})
    .then((favorite)=>{
        if(favorite){
            let index=favorite.dishes.indexOf(req.params.dishId);
            if(index>=0){
                favorite.dishes.splice(index,1);
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                },(err)=>{next(err)})
                
            }
           
               
            else{
                    err = new Error('user dont have this dish on fav ');
                    err.status = 403;
                    return next(err)
                }
            
        }
        else{
            err = new Error('favorite dosent exist ');
            err.status = 403;
            return next(err)
        }
    },(err)=>{next(err)})
    .catch((err)=>next(err))
})

module.exports = favoritesRouter;