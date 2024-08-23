const express=require("express")
const {connect}=require("./config/db")
const userroute=require("./route/user.route")
const taskroute=require("./route/task.route")
const auth=require("./middleware/auth")
const cors=require("cors")
require("dotenv").config()

const app=express()
app.use(express.json())
app.use(cors({
    origin:"*"
}))
app.use("/user",userroute)
app.use("/task",auth,taskroute)

app.get("/",(req,res)=>{
    res.send("Welcome to Kanban App")
})

app.listen(process.env.PORT,async()=>{
    try{
        await connect
        console.log(`Connected to DB and listening on ${process.env.PORT}`)
    }
    catch(err){
        console.log(err)
    }
})
