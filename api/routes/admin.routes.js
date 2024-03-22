// routes/admin.routes.js

import express from 'express';
import { adminSignIn } from '../controllers/admin.controller.js';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';

const router = express.Router();

router.get('/totalUsers', async (req, res, next) => {
    try {
      const totalUsers = await User.countDocuments();
      res.json({ totalUsers });
    } catch (error) {
      next(error);
    }
  });
  
  // Route to get total number of listings
  router.get('/totalListings', async (req, res, next) => {
    try {
      const totalListings = await Listing.countDocuments();
      res.json({ totalListings });
    } catch (error) {
      next(error);
    }
  });

  router.get('/users-with-listings', async (req, res, next) => {
    try {
      // Fetch all listings and populate the 'user' field to get user information for each listing
      const listingsWithUsers = await Listing.find().populate('userRef');
    //   const userName = await User.find().populate('id');
      res.json({ listings: listingsWithUsers });
    } catch (error) {
      console.error('Error fetching listings with users:', error);
      res.status(500).json({ error: 'Failed to fetch listings with users' });
    }
  });
// router.get('/users-with-listings', async (req, res, next) => {
//     try {
//       // Fetch all listings and populate the 'userRef' field to get user information for each listing
//       const listingsWithUsers = await Listing.find().populate('userRef');

//       // Map through the listings to retrieve the user names
//       const formattedListings = await Promise.all(listingsWithUsers.map(async (listing) => {
//         const user = await User.findById(listing.userRef);
//         return {
//           ...listing.toJSON(),
//           userName: user ? user.name : null, // Add the user name to the listing object
//         };
//       }));

//       res.json({ listings: formattedListings });
//     } catch (error) {
//       console.error('Error fetching listings with users:', error);
//       res.status(500).json({ error: 'Failed to fetch listings with users' });
//     }
// });
router.post('/signin', adminSignIn);


export default router;
