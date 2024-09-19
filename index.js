const express= require("express");
const dotenv= require("dotenv")
dotenv.config()
const userRouter= require('./routes/user.route')
const productRouter= require('./routes/product.route')
const connection= require('./config/db')
const cors= require('cors');
const cartRouter = require("./routes/cart.route");

const PORT= process.env.PORT
const app= express()

app.use(cors());
app.options('*', cors());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json())
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)

app.get('/', (req, res)=>{
    res.send('Health check')
})

app.listen(PORT, async()=>{
    try {
        await connection;
        console.log(`server is running on port- ${PORT}  & db is connected`)
    } catch (error) {
        console.log(error)
    }
    
})