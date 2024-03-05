import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => { //this  is the action creator. It will be called when we dispatch this action in our code
            state.loading = true;
          },
          signInSuccess: (state, action) => { //this  is the action when user  logs in successfully here action means the data of user 
            state.currentUser = action.payload; 
            state.loading = false; //loading false means after successfully login  or register the loader will disappear
            state.error = null; // clear any existing errors
          },
          signInFailure: (state, action) => { 
            state.error = action.payload;
            state.loading = false;
          },
           updateUserStart: (state) => {
            state.loading = true;
          },
          updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
          },
          updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
          },
        /*   deleteUserStart: (state) => {
        //     state.loading = true;
        //   },
        //   deleteUserSuccess: (state) => {
        //     state.currentUser = null;
        //     state.loading = false;
        //     state.error = null;
        //   },
        //   deleteUserFailure: (state, action) => {
        //     state.error = action.payload;
        //     state.loading = false;
        //   },
        //   signOutUserStart: (state) => {
        //     state.loading = true;
        //   },
        //   signOutUserSuccess: (state) => {
        //     state.currentUser = null;
        //     state.loading = false;
        //     state.error = null;
        //   },
        //   signOutUserFailure: (state, action) => {
        //     state.error = action.payload;
        //     state.loading = false;
           }, 
        */
        }
      });

export const {
    signInStart,
    signInSuccess,
    signInFailure , 
    updateUserStart,
    updateUserFailure,
    updateUserSuccess} = userSlice.actions;

export default userSlice.reducer;
