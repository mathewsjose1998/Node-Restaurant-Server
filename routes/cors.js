const express=require('express')
const cors=require('cors')
const app=express()

const  Whitelist=['http://localhost:3001','http://localhost:3020']

var corsOptionDelegate=(req,callback)=>{
    var corsOptions;

    if(Whitelist.indexOf(req.header("Origin")) !== -1){// to check that the origin of the request is on the whitelist
        corsOptions={origin :true};
    }
    else{
        corsOptions={origin:false}  //if the req origin is not on Whitelist
    }

    callback(null,corsOptions);
};

exports.cors=cors();// this will be when the access is alowed on all req that is ALLOW ACCES *
  
exports.corsWithOptions=cors(corsOptionDelegate);