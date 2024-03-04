// import React from 'react'
import { useState } from 'react';
import { Link,useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData,setformData] = useState({})
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate=useNavigate();
  const handleChange  = (e) => {  //handleChange function use to track our each and every action which we enter in input 
    setformData({ 
      ...formData,
      [e.target.id] : e.target.value,
    });
  };
  const handleSubmit = async (e) =>{ //handleSubmit is a callback function that passes the data to database  when form is submitted
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup',{
        method: "POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false ) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className = 'flex flex-col gap-4'>
        <input type="text" placeholder="Username" className = 'border p-3 rounded-lg' id="username" onChange={handleChange}/>
        <input type="email" placeholder="email" className = 'border p-3 rounded-lg' id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className = 'border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading..':"Sign Up "}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p className="">Have an account ?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      { error && (
          <strong className='font-bold text-red-600'>{error}</strong> 
      )}
    </div>
  )
}
