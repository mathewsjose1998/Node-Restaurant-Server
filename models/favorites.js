const mongoose =require('mongoose')
const {Schema}=mongoose;



const favoriteSchema=new Schema({
    user:{
        //for mongoose population
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
   },
    dishes:[{
      
         //for mongoose population
         type:mongoose.Schema.Types.ObjectId,
         ref:'Dishes'

    }]
   
})

module.exports= mongoose.model('Favorites',favoriteSchema)