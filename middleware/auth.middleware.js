const jwt= require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const auth=(req, res, next)=>{
    const token= req.headers.token.split(' ')[1]
    
    jwt.verify(token, 'developer', (error, decoded)=>{
        if(error){
            return res.status(403).send(`Token verification failed: ${error.message}`);
        }
        req.body.userId= decoded.id
        // req.body.user= decoded;
        next()
    })
}

module.exports= auth;