const express= require("express");
const dotenv= require("dotenv")
dotenv.config()
const userRouter= require('./routes/user.route')
const connection= require('./config/db')

const PORT= process.env.PORT

const app= express()
app.use(express.json())
app.use('/user', userRouter)

app.get('/', (req, res)=>{
    res.send('Health check')
})

app.listen(PORT, async()=>{
    try {
        await connection;
        console.log('server is running on port- 5000 & db is connected')
    } catch (error) {
        console.log(error)
    }
    
})