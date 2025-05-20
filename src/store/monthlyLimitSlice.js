import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appwriteService from "../appwrite/config";
import { getMonthlyLimitSlug } from '../utils/utils'

export const fetchMonthlyLimit = createAsyncThunk('fetchMonthlyLimit', async (userId) => {
    const getMonthlyData = await appwriteService.getMonthlyLimit(getMonthlyLimitSlug(userId));
    return getMonthlyData;
});



export const saveMonthlyLimit = createAsyncThunk('saveMonthlyLimit', async (data) => {
    const addMonthlyData = await appwriteService.addMonthlyLimit(data);
    return addMonthlyData;
});

export const updateMonthlyLimit = createAsyncThunk('updateMonthlyLimit', async (data) => {
    const updateMonthlyData = await appwriteService.updateMonthlyLimit(data);
    return updateMonthlyData;
});

const initialState = {
    loading: false,
    limit_amount: 0,
    error: null,
    submit_sucess: false,
    success_message: null

}

const monthlyLimitSlice = createSlice({
    name: 'monthlyLimitData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonthlyLimit.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchMonthlyLimit.fulfilled, (state, action) => {
                if(action.payload.status){
                    state.limit_amount = action.payload.data.limit_amount;
                }
            })
            .addCase(fetchMonthlyLimit.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(saveMonthlyLimit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveMonthlyLimit.fulfilled, (state, action) => {
                if(action.payload.status){
                    state.loading = false;
                    state.limit_amount = action.payload.data.limit_amount;
                    state.submit_sucess = true;
                    state.success_message = "Success! Your spending limit for this month have been added successfully.";
                }else{
                    state.loading = false;
                    state.error = action.payload.data?.response.message;
                }
            })
            .addCase(saveMonthlyLimit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateMonthlyLimit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMonthlyLimit.fulfilled, (state, action) => {
                if(action.payload.status){
                    state.loading = false;
                    state.limit_amount = action.payload.data.limit_amount;
                    state.submit_sucess = true;
                    state.success_message = "Success! Your spending limit for this month have been updated successfully.";
                }else{
                    state.loading = false;
                    state.error = action.payload.data?.response.message;
                }
            })
            .addCase(updateMonthlyLimit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default monthlyLimitSlice.reducer;