import express from 'express';
import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

mongoose.connect("mongodb+srv://vandan:vandan@real-estate.ecxgbbb.mongodb.net/real-estate?retryWrites=true&w=majority&appName=real-estate")
.then(()=>{
    console.log("Connected to Database");
})
.catch(err => {console.error(err)});

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000 !!");
    }
);