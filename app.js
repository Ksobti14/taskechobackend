const express=require('express');
const app=express();
require('dotenv').config();
require('./connection/Conn');
const cors=require('cors')
const userAPI=require('./router/user');
const taskAPI=require('./router/task');
app.use(cors());
app.use(express.json());
app.use('/api/v1',userAPI);
app.use('/api/v2',taskAPI);
app.use('/',(req,res)=>{
    res.send('Hello from backend side');
})
const PORT=1000;
app.listen(PORT,()=>(console.log('server started')));