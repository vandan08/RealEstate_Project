import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true ,unique : true},
    email: { type: String, required: true,unique : true },
    password: { type: String, required: true}
},
{ timestamps: true });
// Method to compare a given password with the

const  User = mongoose.model("User", userSchema);
export  default User;

