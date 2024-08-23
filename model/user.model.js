const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        required:true
    }
},{
    versionKey:false
})


const UserModel=mongoose.model("user",userSchema)
module.exports={UserModel}