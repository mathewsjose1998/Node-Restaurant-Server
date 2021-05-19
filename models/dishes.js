const mongoose =require('mongoose')
const {Schema}=mongoose;

const commentSchema=new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    review:{
        type:String,
        required:false
    },
    author:{
        //for mongoose population
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        
    }

})


const dishSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true

    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    fearured:{
        type:Boolean,
        required:false
    },

    comments:[commentSchema]
},{
  timestamps:true
})

// var Dishes=mongoose.model('Dish',dishSchema)

// module.exports=Dishes;

module.exports= mongoose.model('Dishes',dishSchema)