const express = require('express')
const bodyparser = require('body-parser')
var authenticate = require('../authenticate');
const cors = require('./cors');
const dishRouter = express.Router()
const mongoose = require('mongoose')
const Dishes = require('../models/dishes')


dishRouter.use(bodyparser.json())


dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res)=>
{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('inserted ',dish)
        res.statusCode=200
        res.setHeader('content-Type','application/json')
        res.json(dish) // updates body with dishes and updates res.end with it
    },(err)=>next(err))
    .catch((err)=>next(err));  
    })

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res)=>
{
    res.statusCode=403
    res.end('put operation is not supported on dishes')
}) 

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res)=>
{
    Dishes.remove({})
    .then((resp)=>{
        console.log('deleted ',dish)
        res.statusCode=200
        res.setHeader('content-Type','application/json')
        res.json(resp) // updates body with dishes and updates res.end with it
    },(err)=>next(err))
    .catch((err)=>next(err));  

}) ;

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true }) //new true will return updated dish
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});





module.exports = dishRouter;
