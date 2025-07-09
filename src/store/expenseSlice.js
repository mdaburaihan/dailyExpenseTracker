import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appwriteService from "../appwrite/config";

export const saveExpense = createAsyncThunk('saveExpense', async (data) => {
    const addMonthlyData = await appwriteService.addExpense(data);
    return addMonthlyData;
});

export const updateExpense = createAsyncThunk('updateExpense', async (data) => {
    const updteMonthlyData = await appwriteService.updateExpense(data);
    return updteMonthlyData;
});

export const getExpenseById = createAsyncThunk('getExpenseById', async (data) => {
    const expenseByIdData = await appwriteService.getExpenseById(data);
    return expenseByIdData;
});

export const getReceiptById = createAsyncThunk('getReceiptById', async (data) => {
    const receiptByIdData = await appwriteService.getUploadedFileById(data);
    return receiptByIdData;
});

export const uploadExpenseReceipt = createAsyncThunk('uploadExpenseReceipt', async (data) => {
    const receiptFileData = await appwriteService.uploadFile(data);
    return receiptFileData;
});

export const fetchAllCurrentMonthExpenses = createAsyncThunk('fetchAllCurrentMonthExpenses', async (userId) => {
    const currentMonthExpenseData = await appwriteService.getAllCurrentMonthExpenses(userId);
    return currentMonthExpenseData;
});

export const getAllExpensesByYear = createAsyncThunk('getAllExpensesByYear', async (req) => {
    const getAllExpenseData = await appwriteService.getAllExpensesByYear(req.userId, req.year, req.page);
    return getAllExpenseData;
});

const initialState = {
    loading: false,
    error: null,
    submit_sucess: false,
    success_message: null,
    currentMonthExpenseAmount: 0,
    expensesLoading: true,
    expenses: [],
    totalExpenseCount: 0,
    receiptUploadStatus: null,
    receiptUploadError: null,
    receiptFileId: null,
    expense: null,
    receipt: null
}

const expenseSlice = createSlice({
    name: 'expenseData',
    initialState,
    reducers: {
        resetAddExpenseSuccess: (state) => {
            state.submit_sucess = false;
            state.success_message = null;
            state.receiptUploadStatus = null;
            state.receiptUploadError = null;
            state.receiptFileId = null;
        },
        downloadExpenseReceipt: (state, action) => {
            const receiptDownloadedData = appwriteService.getFileDownload(action.payload);
            action.payload = receiptDownloadedData;
        },
        deleteExpenseReceipt: (state, action) => {
            return appwriteService.deleteFile(action.payload);
        }
    },
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
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.loading = false;
                    state.submit_sucess = true;
                    state.success_message = "Success! your expense updated.";
                } else {
                    state.loading = false;
                    state.error = action.payload.data?.response.message;
                }
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getExpenseById.pending, (state) => {
                state.error = null;
            })
            .addCase(getExpenseById.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.expense = action.payload.data;
                }
            })
            .addCase(getExpenseById.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(getReceiptById.pending, (state) => {
                state.error = null;
            })
            .addCase(getReceiptById.fulfilled, (state, action) => {
               state.receipt = action.payload;
            })
            .addCase(getReceiptById.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(uploadExpenseReceipt.pending, (state) => {
                state.receiptUploadStatus = 'loading';
            })
            .addCase(uploadExpenseReceipt.fulfilled, (state, action) => {
                if (action.payload) {
                    state.receiptUploadStatus = 'success';
                    state.receiptFileId = action.payload.$id;
                }
            })
            .addCase(uploadExpenseReceipt.rejected, (state, action) => {
                state.receiptUploadStatus = 'error';
                state.receiptUploadError = action.error.message;
            })
            .addCase(fetchAllCurrentMonthExpenses.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchAllCurrentMonthExpenses.fulfilled, (state, action) => {
                if (action.payload.status && action.payload.data?.documents && action.payload.data.documents.length > 0) {
                    state.currentMonthExpenseAmount = action.payload.data.documents.reduce((sum, obj) => sum + obj.amount, 0);
                }
            })
            .addCase(fetchAllCurrentMonthExpenses.rejected, (state, action) => {
                state.expensesLoading = false;
                state.error = action.error.message;
            })
            .addCase(getAllExpensesByYear.pending, (state) => {
                state.error = null;
            })
            .addCase(getAllExpensesByYear.fulfilled, (state, action) => {
                state.expensesLoading = false;
                if (action.payload.status && action.payload.data?.documents && action.payload.data.documents.length > 0) {
                    state.expenses = action.payload.data.documents;
                    state.totalExpenseCount = action.payload.data.total;
                } else {
                    state.expenses = [];
                    state.totalExpenseCount = 0;
                }
            })
            .addCase(getAllExpensesByYear.rejected, (state, action) => {
                state.expensesLoading = false;
                state.error = action.error.message;
            })
    },
});

export const { resetAddExpenseSuccess, downloadExpenseReceipt, deleteExpenseReceipt } = expenseSlice.actions;
export default expenseSlice.reducer;