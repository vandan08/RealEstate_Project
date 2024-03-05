import { useSelector  } from 'react-redux';
import { useRef,useState,useEffect} from 'react'; // by using useRef we can access the DOM directly by using reference 
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';



export default function Profile() {
  const { currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null); //here we create  a ref for our input field, so that we can access it later in order
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file)=>{
    const storage = getStorage(app); //this is a function  that gets the firebase storage instance
    const fileName = new Date().getTime() + file.name; //gives us unique name for each image uploaded
    const storageRef = ref(storage, fileName); //creates reference to store in Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file); //this is used  to actually upload the files to Firebase Storage and if any error occurs we also get that 
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }) //this  will add the url of the image to form data and then change the avtar to that URL 
        );
      }
    );

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form 
      // onSubmit={handleSubmit} 
      className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
      <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          // defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          // onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          // defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          // onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          // onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg'
        />
        <button
          // disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >Update</button>
        </form>
        <div className='flex justify-between mt-5'>
        <span
          // onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span 
        // onClick={handleSignOut} 
        className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
    </div>
  )
}
