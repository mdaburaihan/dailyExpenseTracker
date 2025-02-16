import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import monthlyLimitSlice from './monthlyLimitSlice';
import expenseSlice from './expenseSlice';

const store = configureStore({
    reducer: {
        auth : authSlice,
        monthlyLimit : monthlyLimitSlice,
        expense : expenseSlice
    }
});


export default store;