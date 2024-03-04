import { useState } from 'react';
import { Link,useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData,setformData] = useState({})
  const {loading,error} = useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const handleChange  = (e) => {  //handleChange function use to track our each and every action which we enter in input 
    setformData({ 
      ...formData,
      [e.target.id] : e.target.value,
    });
  };
  const handleSubmit = async (e) =>{ //handleSubmit is a callback function that passes the data to database  when form is submitted
    e.preventDefault();
    try {
      dispatch(signInStart()); //this action is used to show the loading spinner in Redux Toolkit
      const res = await fetch('/api/auth/signin',{
        method: "POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false ) {
        dispatch(signInFailure(data.message));// this action is used to display error message in Redux Toolkit
        return;
      }
      dispatch(signInSuccess(data)); // this action will save user info into global state and also hide the loading spinner
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message)); //this will be shown when there are errors with our request
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className = 'flex flex-col gap-4'>
        <input type="email" placeholder="email" className = 'border p-3 rounded-lg' id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className = 'border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading..':"Sign In "}
        </button>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p className="">Dont Have an account ?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      { error && (
          <strong className='font-bold text-red-600'>{error}</strong> 
      )}
    </div>
  )
}
