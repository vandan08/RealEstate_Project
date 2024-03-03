import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ // this function will create a entry in database  for the users 
    username: { type: String, required: true ,unique : true}, // unique : true means  that there can be no two same usernames
    email: { type: String, required: true,unique : true }, 
    password: { type: String, required: true}
},
{ timestamps: true }); //it gives us a time when the data  was created and last updated

const  User = mongoose.model("User", userSchema);
export default User;

