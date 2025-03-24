const express = require("express");
const { getAllTasks,createTask,deleteTask, updateTask, getUserTasks, createUserTask,deleteUserTask,updateUserTask } = require("../controllers/taskController");
const authMiddleware = require ("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();
router.get("/",getAllTasks);
router.post("/",createTask);
router.delete("/:id",deleteTask);
router.put("/:id",updateTask);

router.get("/user",authMiddleware, getUserTasks);
router.post("/user",authMiddleware, createUserTask);
router.delete("/user/:id",authMiddleware, deleteUserTask);
router.put("/user/:id",authMiddleware, updateUserTask);

const storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null,"upload/"),
    filename:(req,file,cb) => cb(null,Date.now() + "-"+ file.originalname),
});

const upload = multer({storage});

router.post("/tasks/upload/:id",upload.single("attachment"),async(req,res)=> {
    try{
        const task = await task.findbyId(req.params.id);
        if(!task) return res.status(484).json({message:"Task not found"});

        task.attachments.push(req.file.path);
        await task.save();

        res.json({message: "File uploaded successfully",task});
    } catch (error){
        res.status(500).json({message:"Error uploading file"});
    }
});

module.exports = router;
