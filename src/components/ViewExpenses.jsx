import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getAllExpensesByYear } from '../store/expenseSlice';

function ViewExpenses() {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.userData);
   
    const { expensesLoading, expenses } = useSelector((state) => state.expense);

    const [expenseYear, setExpenseYear] = useState(2025);

    const years = [];
    for (let year = 2025; year >= 2000; year--) {
        years.push(year);
    }

    const handleYearChange = (event) => {
        setExpenseYear(event.target.value);
        dispatch(getAllExpensesByYear({ userId: userData.$id, year: parseInt(event.target.value) }));
    };

    useEffect(() => {
        dispatch(getAllExpensesByYear({ userId: userData.$id, year: 2025 }));
    }, [])

    return (

        <div className="w-full mx-auto">
            <div className="flex justify-end">

                <label htmlFor="expense_year" className="block mb-2 pl-20 text-sm font-medium text-gray-900 dark:text-white">
                    Select a country
                </label>
                <select id="expense_year" value={expenseYear} onChange={handleYearChange} className="bg-gray-50 pl-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>Choose a country</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>



            {!expensesLoading && <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Time
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Reason
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((item, index) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200" key={index}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item.$updatedAt}
                                </th>
                                <td className="px-6 py-4">
                                    {item.amount}
                                </td>
                                <td className="px-6 py-4">
                                    {item.reason}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            }
            {expensesLoading && <div role="status" className='px-8 pt-6 pb-8 mx-100'>
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>}

        </div>





    )
}

export default ViewExpenses