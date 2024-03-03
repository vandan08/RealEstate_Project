import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req,res) =>{
    const  {username,email,password} = req.body; //fetching the data from the post method 'json' data is passed so we have to store it in a variable 
    const hashedPassword = bcryptjs.hashSync(password,10); //this function will encrypt the password with the 2nd argument which we passed a number which is a variable and it helps the function to encrypt the data more sucurely 

    const newuser = new  User({username,email,password:hashedPassword}); // Creating a new user with all the credentials which we get from json and stored it in a user 
    try {
        await newuser.save() // if we have a poor network connection 'await' function will save the data after some time with the save() function 
        res.status(201).json("User Created Succefully");
    } catch (error) { //if something error happens we get an error message in json format 
        res.status(409).json({message: error.message})
    }
}