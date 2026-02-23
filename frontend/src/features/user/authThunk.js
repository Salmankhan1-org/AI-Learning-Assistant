
import axios from "axios";
import { setUser, clearUser, setLoading } from "./authSlice";
import api from "../../helper/axiosAPI";

export const fetchCurrentUser = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const res = await api.get('/users/get/details'); // cookies auto sent
    if(res?.data?.success){
        dispatch(setUser(res.data.data));
    }
  } catch (err) {
    dispatch(clearUser());
  }finally{
    dispatch(setLoading(false));
  }
};
