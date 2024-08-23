const mongoose=require("mongoose")
const taskSchema=mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    status:{type:String,enum:["to-do","done","In-progress"],required:true}
},{versionKey:false,
    timestamps:true
})

const TaskModel=mongoose.model("task",taskSchema)
module.exports={TaskModel}