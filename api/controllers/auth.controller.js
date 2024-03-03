import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req,res,next) =>{
    const  {username,email,password} = req.body; //fetching the data from the post method 'json' data is passed so we have to store it in a variable 
    const hashedPassword = bcryptjs.hashSync(password,10); //this function will encrypt the password with the 2nd argument which we passed a number which is a variable and it helps the function to encrypt the data more sucurely 

    const newuser = new  User({username,email,password:hashedPassword}); // Creating a new user with all the credentials which we get from json and stored it in a user 
    try {
        await newuser.save() // if we have a poor network connection 'await' function will save the data after some time with the save() function 
        res.status(201).json("User Created Succefully");
    } catch (error) { //if something error happens we get an error message in json format 
        // next(errorHandler(550,"error from the function")); //sends  the error to the next middleware function that will handle it
        next(error);    //sends  the error to the next middleware function that will handle it
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const validUser = await User.findOne({ email }); //search for a user with this email on database
      if (!validUser) return next(errorHandler(404, 'User not found!')); //if no user is found send a custom error
      const validPassword = bcryptjs.compareSync(password,validUser.password); //check if the entered password matchs the hash
      if (!validPassword) return next(errorHandler(401, 'Wrong credentials!')); //if no user is found or the password does throws the error of wrong credentials
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //creats a token 
      const { password: pass, ...rest } = validUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } catch (error) {
      next(error);
    }
  };