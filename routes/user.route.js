const express= require('express');
const bcrypt= require('bcrypt');
const UserModel= require('../models/user.model')
const jwt= require('jsonwebtoken');
const isAdmin = require('../middleware/isAdmin.middleware');

const userRouter= express.Router();

userRouter.post('/register', (req, res)=>{
    const {name, email, password}= req.body;
    try {
        bcrypt.hash(password, 2, async(err, hash)=>{
            if(err){
                res.status.send(`error while hashing password ${err}`)
            }

            const user= new UserModel({name, email, password: hash});
            await user.save()
            res.status(200).send({"msg":'New User Registered successfully'})

        })
    } catch (error) {
        res.status(404).send({"msg":`registration failed ${error}`})
    }
})

userRouter.post('/login', async(req, res)=> {
    const {email, password}= req.body;
    
    try {
        const user= await UserModel.findOne({email});

        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                   res.status(500).send({"msg": `error while comparing password ${err}`})
                }
                const token= jwt.sign({email: user.email, id: user._id, name: user.name, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
                res.status(200).send({"msg": "Login successfull", "token": token})
                // if(result){
                //     const token= jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET);
                //     res.status(200).send({"msg": "Login successfull", "token": token})
                // }else{
                //     res.status(404).send({"msg":"login failed- wrong password"})
                // }

            })
        }else{
            res.status(404).send({"msg": 'Login Failed- Incorrect email or register first'})
        }
    } catch (error) {
        res.send("Internal server error || Error in loggin in user", error.message)
    }
})

module.exports= userRouter