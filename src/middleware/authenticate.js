
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");


const Authenticate =async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyToken= jwt.verify(token,process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});

        if(!rootUser) { throw new Error("User not found"); }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
        
    } catch (error) {
        res.status(401).send("Unauthorized:no token provided");
        console.error(error);
    }
}

module.exports =Authenticate;