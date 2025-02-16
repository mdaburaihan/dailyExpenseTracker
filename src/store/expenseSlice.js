import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appwriteService from "../appwrite/config";

export const saveExpense = createAsyncThunk('saveExpense', async (data) => {
    const addMonthlyData = await appwriteService.addExpense(data);
    return addMonthlyData;
});

export const fetchAllCurrentMonthExpenses = createAsyncThunk('fetchAllCurrentMonthExpenses', async (userId) => {
    const currentMonthExpenseData = await appwriteService.getAllCurrentMonthExpenses(userId);
    return currentMonthExpenseData;
});

const initialState = {
    loading: false,
    error: null,
    submit_sucess: false,
    success_message: null,
    currentMonthExpenseAmount: 0
}

const expenseSlice = createSlice({
    name: 'expenseData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveExpense.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.loading = false;
                    state.submit_sucess = true;
                    state.success_message = "Success! your expense added.";
                } else {
                    state.loading = false;
                    state.error = action.payload.data?.response.message;
                }
            })
            .addCase(saveExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAllCurrentMonthExpenses.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchAllCurrentMonthExpenses.fulfilled, (state, action) => {
                if (action.payload.status && action.payload.data?.documents && action.payload.data.documents.length>0) {
                    console.log("==action.payload.data==", action.payload.data.documents)

                    state.currentMonthExpenseAmount = action.payload.data.documents.reduce((sum, obj) => sum + obj.amount, 0);
                }
            })
            .addCase(fetchAllCurrentMonthExpenses.rejected, (state, action) => {
                state.error = action.error.message;
            })
    },
});

export default expenseSlice.reducer;