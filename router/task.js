const router=require('express').Router();
const Task=require('../models/task');
const User=require('../models/user');
const authToken = require('./auth');
//create-task
router.post('/createtask',authToken,async(req,res)=>{
    try {
        const {title,desc}=req.body;
        const {id}=req.headers;
        const newTask=new Task({title:title,desc:desc});
        const saveTask=await newTask.save();
        const taskId=saveTask._id;
        await User.findByIdAndUpdate(id,{$push:{tasks:taskId._id}});
        res.status(200).json({message:"Task Created"})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
});
//get all tasks
router.get('/getalltasks',authToken,async(req,res)=>{
    try {
        const {id}=req.headers;
        const userData=await User.findById(id).populate({path:"tasks",options:{sort:{createdAt:-1}},});
        res.status(200).json({data:userData});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
//delete tasks
router.delete('/deletetasks/:id',authToken,async(req,res)=>{
    try {
        const {id}=req.params;
        const userId=req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId,{$pull:{tasks:id}});
        res.status(200).json({message:"Task deleted Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
//update tasks
router.put('/updatetasks/:id',authToken,async(req,res)=>{
    try {
        const {id}=req.params;
        const {title,desc}=req.body;
        await Task.findByIdAndUpdate(id,{title:title,desc:desc});
        res.status(200).json({message:"Task updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
//update important tasks
router.put('/updateimptasks/:id',authToken,async(req,res)=>{
    try {
        const {id}=req.params;
        const Taskdata=await Task.findById(id);
        const imptask=Taskdata.important;
        await Task.findByIdAndUpdate(id,{important:!imptask});
        res.status(200).json({message:"Task updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
//update complete tasks
router.put('/updatecomptasks/:id',authToken,async(req,res)=>{
    try {
        const {id}=req.params;
        const Taskdata=await Task.findById(id);
        const comptask=Taskdata.complete;
        await Task.findByIdAndUpdate(id,{complete:!comptask});
        res.status(200).json({message:"Task updated Successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
});
router.get('/getimptasks',authToken,async(req,res)=>{
    try {
        const {id}=req.headers;
        const Data=await User.findById(id).populate({path:"tasks",match:{important:true},options:{sort:{createdAt:-1}},});
        const Imptaskdata=Data.tasks;
        res.status(200).json({data:Imptaskdata});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
router.get('/getcomptasks',authToken,async(req,res)=>{
    try {
        const {id}=req.headers;
        const Data=await User.findById(id).populate({path:"tasks",match:{complete:true},options:{sort:{createdAt:-1}},});
        const Comptaskdata=Data.tasks;
        res.status(200).json({data:Comptaskdata});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
router.get('/getincomptasks',authToken,async(req,res)=>{
    try {
        const {id}=req.headers;
        const Data=await User.findById(id).populate({path:"tasks",match:{complete:false},options:{sort:{createdAt:-1}},});
        const Comptaskdata=Data.tasks;
        res.status(200).json({data:Comptaskdata});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"})
    }
})
module.exports=router;