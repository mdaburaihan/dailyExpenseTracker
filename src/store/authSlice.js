import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            localStorage.setItem('userData', action.payload.userData);
            //expire in 10 minutes from current time
            const expiryTime = new Date(Date.now() + 60 * 1000).toISOString();
            localStorage.setItem('userDataExpiry', expiryTime);
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            localStorage.removeItem('userData');
            localStorage.removeItem('userDataExpiry');
        }
     }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;