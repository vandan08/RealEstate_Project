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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }); //this will check whether user is registered or not 
    
    //so if user is not registered so we have to create a token with jwt and add it in a cookie so we can access it 
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc; //we don't have to save user's  password in cookie so we have to save password in different way 
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //so when we signup with google we never show any field of password so we have to create a random password manually  with this Math functions 
      //it will generate a random 8 digit password from a-z and 1-9 it will create like this 0.438hea3a and slice the last 8 digit 
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      //create new user based on google profile information 
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

