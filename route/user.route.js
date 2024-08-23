const mongoose=require("mongoose")
const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("dotenv").config()
const {UserModel}=require("../model/user.model")
const {BlacklistModel}=require("../model/blacklist.model")
const auth=require("../middleware/auth")
const route=express.Router()

route.post("/register",async(req,res)=>{
    const {email,pass,role}=req.body
    try{
        const exist=await UserModel.findOne({email})
        if(exist){
            return res.send("User already register")
        }
        bcrypt.hash(pass,5,async(err,hash)=>{
            if(err){
                return res.send("Error while hashing password")
            }
            const user=new UserModel({
                email,
                pass:hash,
                role
            })
            await user.save()
            return res.status(200).json({message: "User registered successfully",user})
        })
    }
    catch(err){
        console.log(err)
        res.json({
            message:"server error"
        })
    }
})

route.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"Register first"})
        }
        bcrypt.compare(pass,user.pass,(err,result)=>{
            if(err){
                return res.status(400).json({message:"Wrong credentials"})
            }
            if(result){
                const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN})
                res.status(200).json({message:"Login successful",token})
            }else{
                return res.status(400).json({message:"Wrong credentials"})
            }
        })
    }
    catch(err){
        console.log(err)
        res.json({
            message:"server error"
        })
    }
})

route.post("/logout",auth,async(req,res)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
        const blacklistedToken = new BlacklistModel({ token});
        await blacklistedToken.save();
        res.status(200).json({ message: 'User logged out successfully' });      
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:err
        })
    }
})

module.exports=route