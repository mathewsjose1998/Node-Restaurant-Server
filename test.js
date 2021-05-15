var express = require("express");
var mongoose=require('mongoose')

const app=express()

const mongoAtlasUri="mongodb+srv://mathews_pwj:lvzHx2XBFOnYchQ2@cluster0.9tyvt.mongodb.net/nodemongo?retryWrites=true&w=majority"


    // Connect to the MongoDB cluster
     mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },)

      .then(()=>{
        console.log('conected')
      })

app.get('/test',(req,res)=>{
    res.send("tesssstedd")
})



app.listen(4000,()=>console.log("port 4000"))