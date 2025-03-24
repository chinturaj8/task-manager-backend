
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use("/uploads",express.static("uploads"));


app.use(express.json());
app.use(cors());
app.use(cors({credentials:true,origin: "http://localhost:3000"}))


const MONGO_URI = "mongodb://localhost:27017/taskDb";

mongoose.connect(MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connected Error:", err));


app.get("/",(req,res) =>{
    res.send(" Task Manager API is Running!");
});


app.use("/api/tasks",taskRoutes);
app.use("/api/auth",authRoutes);

const PORT =  process.env.PORT ||  7000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));


