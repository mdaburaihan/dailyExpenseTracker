import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux";
import { saveExpense, fetchAllCurrentMonthExpenses } from '../store/expenseSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchMonthlyLimit } from '../store/monthlyLimitSlice';

function AddExpense() {
    const dispatch = useDispatch();
    const { limit_amount } = useSelector((state) => state.monthlyLimit);
    const { currentMonthExpenseAmount } = useSelector((state) => state.expense);
    const [ addExpenseError, SetAddExpenseError ] = useState(null)

    const { loading, error, submit_sucess, success_message } = useSelector((state) => state.expense);

    const userData = useSelector((state) => state.auth.userData);
    const { register, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm()

    const addExpense = (data) => {
        try {
           
            dispatch(saveExpense({ ...data, user_id: userData.$id, currentMonthExpenseAmount }));
            dispatch(fetchMonthlyLimit(userData.$id));
            
            reset();
        } catch (error) {
            console.log(error)
            toast.error('Error: Something went wrong. Please try again.');
        }
    }

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if(name === "amount"){
                if(value.amount>limit_amount){
                    SetAddExpenseError('You have exceeded monthly limit.');
                }else{
                    SetAddExpenseError(null);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, limit_amount]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        dispatch(fetchAllCurrentMonthExpenses(userData.$id));
    }, [userData.$id]);

    useEffect(() => {
        if (submit_sucess) {
            toast.success(success_message);
        }
    }, [submit_sucess]);

    return (
        <div className="w-full mx-auto">
            <button type="button" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Your have left Rs. {limit_amount-currentMonthExpenseAmount} to spend for this month</button>
            {!loading && <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mx-100" onSubmit={handleSubmit(addExpense)}>
                <div className="mb-4">
                    <p>Submit your expense here</p>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                        Amount
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? "border-red-500" : ""}`}
                        id="amount"
                        type="text"
                        placeholder="Enter amount"
                        {...register("amount", {
                            required:true,
                            min: 1,
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Please enter a valid numeric value",
                            },
                            // validate: (value) => {
                            //     if (value>limit_amount) {
                            //       return false;
                            //     }
                            //     return true;
                            // }
                        })}
                    />
                    {errors && errors.amount && <p className="text-red-500 text-xs italic">Invalid amount</p>}
                    {addExpenseError && <p className="text-red-500 text-xs italic">{addExpenseError}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                        Expense Details
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? "border-red-500" : ""}`}
                        id="reason"
                        type="text"
                        placeholder="Enter expense details"
                        {...register("reason", {
                            required: true,
                            min: 1,
                            pattern: {
                                value: /^[a-zA-Z0-9]{1,50}$/,
                                message: "Reason should be alphanumeric (max 50 characters)",
                            }
                        })}
                    />
                    {errors && errors.reason && <p className="text-red-500 text-xs italic">Reason should be in alphanumeric</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className={`${isValid ? "bg-blue-500" : "bg-gray-500"} 
                      hover: ${isValid ? "bg-blue-700" : "bg-gray-700"}
                      text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                      cursor: ${isValid ? "cursor-pointer" : "cursor-not-allowed"}`}
                        type="submit"
                        disabled={!isValid}
                    >
                        Add
                    </button>
                </div>
            </form>}
            {loading && <div role="status" className='px-8 pt-6 pb-8 mx-100'>
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>}
            <ToastContainer />
        </div>
    )
}

export default AddExpense