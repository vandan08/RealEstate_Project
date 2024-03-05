import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import  authRouter from './routes/auth.route.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import listingRouter from  './routes/listing.route.js';
// require("dotenv").config();
dotenv.config(); 

mongoose.connect("mongodb+srv://vandan:vandan@real-estate.ecxgbbb.mongodb.net/real-estate?retryWrites=true&w=majority&appName=real-estate")
.then(()=>{
    console.log("Connected to Database");
})
.catch(err => {console.error(err)});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running on port 3000 !!");
    }
);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter); 
app.use('/api/listing', listingRouter); 

app.use((err,req,res,next)=>{ //this is the middleware function to create a function to handle errors while fetching or pushing data in database 
    const  status= err.status || 500;   
    const message  = err.message|| "Internal Server Error";
    return  res.status(status).send({
        success: false,
        status,
        message
    });
})