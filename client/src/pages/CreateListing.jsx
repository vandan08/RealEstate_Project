import { useState } from 'react'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    ptype : 'house',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    security: false,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    //if the files are between 0-7 
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
  
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
        }
        Promise.all(promises)
          .then((urls) => {
            setFormData({
              ...formData,
              imageUrls: formData.imageUrls.concat(urls),
            });
            setImageUploadError(false);
            setUploading(false);
          })
          .catch((err) => {
            setImageUploadError('Image upload failed (2 mb max per image)');
            setUploading(false);
          });
      } else {
        setImageUploadError('You can only upload 6 images per listing');
        setUploading(false);
      }
};

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'type') {
        // Handling radio buttons for property type (house, farm, plot, pg)
        setFormData({
          ...formData,
          ptype: e.target.value,
        });
      }
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer' ||
      e.target.id === 'security'      
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Create a Listing
        </h1>
        <form 
        onSubmit={handleSubmit}
         className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input
                    type='text'
                    placeholder='Name'
                    className='border p-3 rounded-lg'
                    id='name'
                    maxLength='62'
                    minLength='10'
                    required
                    onChange={handleChange}
                    value={formData.name}
                />
                <textarea
                    type='text'
                    placeholder='Description'
                    className='border p-3 rounded-lg'
                    id='description'
                    required
                    onChange={handleChange}
                    value={formData.description}
                />
                <input
                    type='text'
                    placeholder='Address'
                    className='border p-3 rounded-lg'
                    id='address'
                    required
                    onChange={handleChange}
                    value={formData.address}
                />
                {/* All the Type of property should be displayed here */}
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <p >Type : </p>
                        <input
                            type='radio'
                            id='house'
                            name='type'
                            value='house'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.ptype === 'house'}
                        />
                        <span>House</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='radio'
                            id='farm'
                            name='type'
                            value='farm'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.ptype === 'farm'}
                        />
                        <span>Farm</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='radio'
                            id='plot'
                            name='type'
                            value='plot'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.ptype === 'plot'}
                        />
                        <span>Plot(Land)</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='radio'
                            id='pg'
                            name='type'
                            value='pg'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.ptype === 'pg'}
                        />
                        <span>PG</span>
                    </div>
                </div>
                {/* All the IMP of property should be displayed here */}
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='sale'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='rent'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='security'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.security}
                        />
                        <span>Security</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='parking'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.parking}
                        />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='furnished'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.furnished}
                            disabled={formData.ptype === 'farm' || formData.ptype === 'plot'}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='offer'
                            className='w-5'
                            onChange={handleChange}
                            checked={formData.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input
                            type='number'
                            id='bedrooms'
                            min='1'
                            max='10'
                            required
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.bedrooms}
                            disabled={formData.ptype === 'plot'}
                        />
                        <p>{formData.ptype === 'farm' ? 'Rooms' : 'Beds'}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type='number'
                            id='bathrooms'
                            min='1'
                            max='10'
                            required =  {formData.ptype !== 'plot'}
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.bathrooms}
                            disabled={formData.ptype === 'plot'}
                        />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type='number'
                            id='regularPrice'
                            min='50'
                            max='100000000'
                            required ={formData.ptype !== 'plot'}
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.regularPrice}
                        />
                        <div className='flex flex-col items-center'>
                            <p>Regular price</p>
                              {formData.type === 'rent' && (
                                <span className='text-xs'>({formData.ptype === 'farm' ? '₹ / day' : '₹ / month'})</span>
                              )}
                        </div>
                    </div>
                    {formData.offer && (
                    <div className='flex items-center gap-2'>
                        <input
                            type='number'
                            id='discountPrice'
                            min='0'
                            max='100000000'
                            required
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.discountPrice}
                        />
                        <div className='flex flex-col items-center'>
                            <p>Discounted price</p>
                              {formData.type === 'rent' && (
                                <span className='text-xs'>({formData.ptype === 'farm' ? '₹ / day' : '₹ / month'})</span>
                              )}
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>
                    Images:
                    <span className='font-normal text-gray-600 ml-2'>
                    The first image will be the cover (max 6)
                    </span>
                </p>
                <div className='flex gap-4'>
                    <input
                        onChange={(e) => setFiles(e.target.files)}
                        className='p-3 border border-gray-300 rounded w-full'
                        type='file'
                        id='images'
                        accept='image/*'
                        multiple
                    />

                    <button
                        type='button'
                        disabled={uploading}
                        onClick={handleImageSubmit}
                        className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                    >
                    {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                    <p className='text-red-700 text-sm'>
                        {imageUploadError && imageUploadError}
                    </p>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index) => (
                        <div
                            key={url}
                            className='flex justify-between p-3 border items-center'
                        >
                            <img
                            src={url}
                            alt='listing image'
                            className='w-20 h-20 object-contain rounded-lg'
                            />
                            <button
                            type='button'
                            onClick={() => handleRemoveImage(index)}
                            className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                            >
                            Delete
                            </button>
                        </div>
                        ))}
                
                <button 
                    disabled={loading || uploading}
                    className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Creating...' : 'Create listing'}
                </button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
        </form>
    </main>
  )
}
