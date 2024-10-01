const jwt= require('jsonwebtoken');

const isAdmin=(req, res, next)=>{
    const token= req.headers.token.split(' ')[1];

    jwt.verify(token, 'developer', (error, decoded)=>{
        if(error){
            return res.status(403).send(`Token verification failed: ${error.message}`);
        }

        req.user= decoded;
        next();
    })

}

module.exports= isAdmin