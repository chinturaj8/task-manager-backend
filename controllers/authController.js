const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req,res) => {
    try {
        const {username, email, password} = req.body;
        const existingUser = await  User.findOne({email});
        if (existingUser) return res.status(400).json({message: "Email already in use"});
        const newUser =new User({ username, email, password});
        await newUser.save();
        
        res.status(201).json({message: "User registered successfully"});
    } catch(error) {
        res.status(500).json({ message: error.message});
    }
};

exports.login = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid email or password"});
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid email or password"});

        const token = jwt.sign({userId: user._id }, "secret_key", { expiresIn: "1h"});

        res.json({ message: "Login successfully",token});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }  
  };

  exports.verifyUser = async(req ,res) => {
    try {
        res.join({ success: true,message:"user verified"});
    } catch(error){
        res.status(500).json({message: "verification failed"});
    } 
 };