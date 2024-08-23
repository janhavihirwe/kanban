const express=require("express")
const {TaskModel}=require("../model/task.model")
const role=require("../middleware/role")
const { UserModel } = require("../model/user.model")
const route=express.Router()

route.post("/create-task",role(["admin","user"]),async(req,res)=>{
    const {title,description,status}=req.body
    const userId=req.user._id
    try{
        const task=new TaskModel({
            title,
            description,
            status,
            userId
        })
        await task.save()
        return res.status(200).json({message:"Task created"})
    }
    catch(err){
        res.send("Error while creating task")
    }
})

route.get("/",role(["user","admin"]),async(req,res)=>{
    const userId=req.user._id
    const {page=1}=req.query
    const limit=5
    try{
        const skip = (page - 1) * limit;
        const task=await TaskModel.find({userId}).limit(limit).skip(skip)
        if(!task){
            res.send("No tasks")
        }
        return res.status(200).json({task})
    }
    catch(err){
        res.send("Error while fetching task")
    }
})

route.patch("/update-status/:id",role(["user","admin"]),async(req,res)=>{
    const payload=req.body
    const taskId=req.params.id
    const userId=req.user._id
    try{
        const task=await TaskModel.findOne({_id:taskId})
        console.log(task)
        if(task.userId.toString()=== userId.toString()){
            const task1=await TaskModel.findByIdAndUpdate({_id:taskId},payload,{new:true})
            await task1.save()
            res.status(200).json({message:"Task updated successfully",task1})
        }else{
            res.send("Unauthorized user")
        }
    }
    catch(err){
        console.log(err)
        res.send("Error while updating task")
    }
})

route.delete("/delete-task/:id",role(["admin"]),async(req,res)=>{
    const taskId=req.params.id
    try{
        const task=await TaskModel.findOneAndDelete({_id:taskId,userId:req.user._id})
        if(!task){
            return res.send("Task not found")
        }
        return res.status(200).send("Task deleted successfully")
    }
    catch(err){
        console.log(err)
        res.send("Error while deleting task")
    }
})

module.exports=route