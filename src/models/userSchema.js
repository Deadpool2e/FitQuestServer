const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:Number,
        required: true,
        unique: true,
    },
    gender:{
        type:Number,
    },
    age:{
        type:Number,
    },
    password:{
        type:String,
        required: true,
    },
    confirmpassword:{
        type:String,
        required: true,
    },
    tokens:[
        {
            token:{
                type:String,
                required: true,
            }
        }
    ]
})

//password hashing function
userSchema.pre('save',async function(next){
    // console.log("hellp");
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password,12);
        this.confirmpassword = bcrypt.hashSync(this.confirmpassword,12);
    }
    next();
})

//generating token
userSchema.methods.generateToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}



const User = new mongoose.model("User",userSchema);

module.exports = User;