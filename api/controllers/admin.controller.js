// controllers/admin.controller.js

import Admin from "../models/admin.model.js";
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

export const adminSignIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validAdmin = await Admin.findOne({ email });
    if (!validAdmin) return next(errorHandler(404, 'Admin not found!'));
    if (validAdmin.password !== password) return next(errorHandler(401, 'Wrong credentials!')); // Compare passwords directly
    const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validAdmin._doc;
    res
      .cookie('admin_access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
