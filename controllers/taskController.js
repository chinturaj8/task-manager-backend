const Task = require("../models/Task");
exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await Task.find();
        res.json(tasks);
    }catch (error){
        res.status(500).json({ message: error.message});
    }
};
exports.createTask = async (req,res) => {
    try{
        const newTask = new Task({ title:req.body.title});
        await newTask.save();
        res.json(newTask);
    } catch (error){
        res.status(500).json({message: error.message});
    }
};
exports.deleteTask = async (req,res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({message: "Task deleted"});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
    };

exports.updateTask = async (req,res) => {
    try {
        const updatedTask= await Task.findByIdAndUpdate(req.params.id,req.body,{ new: true});
        res.json({message:"task updated"});
        
        
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

exports.getUserTasks = async(req, res) => {
    try{
         console.log("Request Headers:", req.headers);
         console.log("Extracted users:",req.user);
         if(!req.user || !req.user._id){
            return res.status(401).json({ message:"Unauthorized :user id missing"});
         }

        const userId = req.user.id;
        console.log("Fetching tasks for user id",userId);

        const{ page = 1,limit = 5,search = "" } = req.query;
        const query = { user:userId,title: {$regex:search,$options: "i"}};

        const tasks = await Task.find(query)
        .sort({createdAt:1})
        .skip((page - 1) * limit )
        .limit(number(limit));

        console.log("Tasks Found",tasks.length);

        res.status(200).json({
            tasks,
            total:await Task.countDocuments(query),
            page:Number(page),
            pages:Math.ceil((await Task.countDocuments(query)) / limit),
        });
    } catch(error){
        console.error("Error fetching tasks:",error);
        res.status(500).json({ message:"Error fetching user-specific tasks"});
    }
};

exports.createUserTask = async (req,res)=> {
    try {
        const { title,status } = req.body;
        if(!title){
            return res.status(400).json({ message:"Task title is required"});
        }
        const newTask = new Task({
            title,
            status:status|| "Not started",
            user: req.user.id,
        });
            await newTask.save();
            res.status(201).json({message:"Task created successfully",task:newTask});
        } catch(error) {
            res.status(500).json({ message: "Error creating  task",error:error.message});
        }
        };
exports.deleteUserTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id});
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized"});
        }
        res.json({ message: "user-specific task deleted"});
    } catch(error) {
        res.status(500).json({message: "Error deleting user-specific task"});
    }
    };

exports.updateUserTask = async(req, res) => {
    try {
        const updatedTask = await Task.findOneAndDelete ({
            _id: req.params.id, user: req.user.id},req.body,{new: true});
           if(!updatedTask) {
            return res.status(404).json({message: "Task not found or unauthorized"});
           }
           res.json(updatedTask);
    } catch(error) {
        res.status(500).json({message:"Error updating user-specific task"});
    }
};


