import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { saveMonthlyLimit, updateMonthlyLimit, resetMonthlyLimitSuccess } from '../store/monthlyLimitSlice';

function MonthlyLimit() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const { loading, limit_amount, error, submit_sucess, success_message } = useSelector((state) => state.monthlyLimit);
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        defaultValues: {
            amount: limit_amount || 0
        },
        mode: "onChange"
    });

    // Keep form in sync with limit_amount
    useEffect(() => {
        reset({ amount: limit_amount || 0 });
    }, [limit_amount]);

    const addUpdateLimit = (data) => {
        if (!userData?.$id) {
            toast.error('User not found.');
            return;
        }
        if (limit_amount > 0) {
            dispatch(updateMonthlyLimit({ ...data, user_id: userData.$id }))
                .unwrap()
                .then(() => reset({ amount: data.amount }))
                .catch(() => { });
        } else {
            dispatch(saveMonthlyLimit({ ...data, user_id: userData.$id }))
                .unwrap()
                .then(() => reset({ amount: data.amount }))
                .catch(() => { });
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { autoClose: 5000 });
        }
    }, [error]);

    useEffect(() => {
        if (submit_sucess) {
            toast.success(success_message, { autoClose: 3000 });
            dispatch(resetMonthlyLimitSuccess());
        }
    }, [submit_sucess, success_message]);

    return (
        <div className="w-full mx-auto">
            <button
                type="button"
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
                Your monthly spending limit for this month: Rs. {limit_amount}
            </button>
            {!loading && (
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mx-100" onSubmit={handleSubmit(addUpdateLimit)}>
                    <div className="mb-4">
                        <p>You can't spend money beyond monthly limit.</p>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            Enter Amount
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.amount ? "border-red-500" : ""}`}
                            id="amount"
                            type="number"
                            min={1}
                            placeholder="Enter amount here"
                            {...register("amount", {
                                required: "Amount is required",
                                min: { value: 1, message: "Amount must be at least 1" },
                                valueAsNumber: true,
                                validate: value => Number.isFinite(value) || "Please enter a valid number"
                            })}
                        />
                        {errors.amount && <p className="text-red-500 text-xs italic">{errors.amount.message}</p>}
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
                            {limit_amount && limit_amount > 0 ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            )}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                    <div role="status" className="flex flex-col items-center">
                        <svg
                            aria-hidden="true"
                            className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    )
}

export default MonthlyLimit