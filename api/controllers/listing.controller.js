import Listing from "../models/listing.model.js";
import { errorHandler } from '../utils/error.js';


export const createListing = async (req, res, next) => {
    try {
        //create a new model in database 
      const listing = await Listing.create(req.body);
      return res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  };

  export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
  
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
  
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      next(error);
    }
  };

  export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    // if we don't get listing  back then it is invalid id or no such listing exist
    if (!listing) { 
      return next(errorHandler(404, 'Listing not found!'));
    } // if the current user and the listed user are same then allow to edit else throw error
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

  export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  };

  export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer = req.query.offer;
      // this basically search in the database if the offer checkbox is not checked or the offer value is null because if we directly go to the search we show us all the listings have offer or not 
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let security = req.query.security;
  
      if (security === undefined || security === 'false') {
        security = { $in: [false, true] };
      }

      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }

      // let ptype = req.query.ptype;
      
      // if (type === undefined || type === 'all') {
      //   type = { $in: ['house','farm','plot','pg'] };
      // }
  
      const searchTerm = req.query.searchTerm || '';
      const ptype = req.query.ptype || ''; // Add this line to get the ptype query parameter
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      // const listings = await Listing.find({
      //   // $or: [
      //   //   { name: { $regex: searchTerm, $options: 'i' } },
      //   //   { address: { $regex: searchTerm, $options: 'i' } },
      //   //   { ptype: { $regex: ptype, $options: 'i' } },
      //   // ],
      //   name: { $regex: searchTerm, $options: 'i' },
      //   offer,
      //   furnished,
      //   security,
      //   parking,
      //   type,
      //   // ptype
      // })
      //   .sort({ [sort]: order })
      //   .limit(limit)
      //   .skip(startIndex);

      const listingsQuery = {
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      };
  
      // Add a condition to filter by ptype if it is not empty
      if (ptype !== '' && ptype !== 'all') {
        listingsQuery.ptype = ptype;
      }
  
      const listings = await Listing.find(listingsQuery)
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
  