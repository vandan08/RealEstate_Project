import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';


// eslint-disable-next-line react/prop-types
export default function ListingItem({listing}) {
    // eslint-disable-next-line react/prop-types
    const isPlot = listing.ptype === 'plot';
    // eslint-disable-next-line react/prop-types
    const isFarm = listing.ptype === 'farm';
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      {/* eslint-disable-next-line react/prop-types */}
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            // eslint-disable-next-line react/prop-types
            listing.imageUrls[0] || 
            'https://firebasestorage.googleapis.com/v0/b/real-estate-d59dd.appspot.com/o/Screenshot%202024-03-07%20132159.png?alt=media&token=136cc0fd-4562-4462-a078-a3f71763c4a6'
          }
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {/* eslint-disable-next-line react/prop-types */}
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {/* eslint-disable-next-line react/prop-types */}
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {/* eslint-disable-next-line react/prop-types */}
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold '>
          ₹
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          {/* <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div> */}
          {!isPlot && (
            <div className='text-slate-700 flex gap-4'>
              <div className='font-bold text-xs'>
                {isFarm ? `${listing.bedrooms} rooms` : 
                  listing.bedrooms > 1
                    ? `${listing.bedrooms} beds `
                    : `${listing.bedrooms} bed `}
              </div>
              <div className='font-bold text-xs'>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
