import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/user/authSlice.js'


export default configureStore({
    reducer:{
        auth : authReducer
    }
})