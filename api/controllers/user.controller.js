import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';


export const test = (req, res) => {
  res.json({
    message: 'APi'
  })
  };

  //this function  is used to get all the updated data of user and change it in database 
export const updateUser = async (req, res, next) => {
  //if the user id is not same as the id which pass throgh  url then return an error massage
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    //if user wants to change password 
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    //update the user data in the database , 'data' getting from body 
    const updatedUser = await User.findByIdAndUpdate( 
      // findByIdAndUpdate is an mongodb function to find the user by it's id and update the user's data 
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  // check the user id  with params id or not
  if (req.user.id !== req.params.id) 
    return next(errorHandler(401, 'You can only delete your own account!'));
  try { 
    // findByIdAndDelete this will search the data behalf of id and delete that user 
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};


