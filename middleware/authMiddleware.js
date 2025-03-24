const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authMiddleware = async(req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer","");
    if(!token){
        return res.status(401).json({ message:"Unauthorized:No token provided"});
    
}
 try{
    const decoded = jwt.verify(token,process.env.JWT_SECREAT);
    console.log("Decoded Token:",decoded);

    req.user = await User.findById(decoded.userId).select("password");
    console.log("Authenticated User:",req.user);

    if(!req.user){
        return res.status(401).json({ message:"Unauthorized :No tokens"  });
    }
    next();
} catch(error){
    res.status(401).json({ message: "Unauthorized :No tokens" });

}
};
module.exports = authMiddleware;