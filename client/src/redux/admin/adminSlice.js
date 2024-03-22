import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = {
  loading: false,
  error: null,
  admin: null,
  totalUsers: 0,
  totalListings: 0,
};
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.admin = action.payload;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.loading = false;
      state.error = null;
      state.admin = null;
    },
    setTotalUsers: (state, action) => {
      state.totalUsers = action.payload;
    },
    setTotalListings: (state, action) => {
      state.totalListings = action.payload;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signOut,setTotalUsers, setTotalListings } = adminSlice.actions;

// Action creator to fetch total number of users
export const fetchTotalUsers = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/admin/totalUsers');
    dispatch(setTotalUsers(response.data.totalUsers));
  } catch (error) {
    // Handle error
  }
};

// Action creator to fetch total number of listings
export const fetchTotalListings = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/admin/totalListings');
    dispatch(setTotalListings(response.data.totalListings));
  } catch (error) {
    // Handle error
  }
};

export default adminSlice.reducer;
