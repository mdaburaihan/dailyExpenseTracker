import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { getAllExpensesByYear, downloadExpenseReceipt } from '../store/expenseSlice';
import Pagination from './common/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import { PAGE_SIZE } from '../conf/constants';
import { useNavigate } from "react-router-dom";
import { getCurrentYear, getCurrentMonth } from '../utils/utils'

function ViewExpenses() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const { expensesLoading, expenses, totalExpenseCount } = useSelector((state) => state.expense);
    const pageSize = PAGE_SIZE;
    const navigate = useNavigate();

    const currentYear = getCurrentYear()
    const currentMonth = getCurrentMonth()

    const [expenseYear, setExpenseYear] = useState(currentYear);
    const [currentPage, setCurrentPage] = useState(1);

    const years = [];
    for (let year = currentYear; year >= 2000; year--) {
        years.push(year);
    }

    const handleYearChange = (event) => {
        const selectedYear = parseInt(event.target.value);
        setCurrentPage(1);
        setExpenseYear(selectedYear);
        if (userData?.$id) {
            dispatch(getAllExpensesByYear({ userId: userData.$id, year: selectedYear }));
        }
    };

    const handleExpenseEdit = (item) => {
        navigate(`/edit-expense/${item.$id}`);
    };

    const onPageChange = (page) => {
        const totalPages = Math.max(1, Math.ceil(totalExpenseCount / pageSize));
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        if (userData?.$id) {
            dispatch(getAllExpensesByYear({ userId: userData.$id, year: expenseYear, page: page }));
        }
    };

    const handleReceiptDownload = (fileId) => {
        let receiptDownload = dispatch(downloadExpenseReceipt(fileId))
        if(receiptDownload?.payload){
            window.open(receiptDownload.payload, "_blank");
        }else{
            toast.error('Error downloading receipt. Please try again later.');
        }   
    }

    useEffect(() => {
        if (userData?.$id) {
            dispatch(getAllExpensesByYear({ userId: userData.$id, year: expenseYear }));
        }
    }, [dispatch, userData?.$id, expenseYear]);

    return (
        <div className="w-full mx-auto">
            <div className="flex justify-end">
                <label htmlFor="expense_year" className="block mb-2 pl-20 text-sm font-medium text-gray-900 dark:text-white">
                    Select Year
                </label>
                <select
                    id="expense_year"
                    value={expenseYear}
                    onChange={handleYearChange}
                    className="bg-gray-50 pl-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            {!expensesLoading && (
                <div className="relative overflow-x-auto">
                    {expenses.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No expenses found for {expenseYear}.</div>
                    ) : (
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Reason</th>
                                    <th scope="col" className="px-6 py-3">Receipt</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((item) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200" key={item.$id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                           {new Date(item.$updatedAt).toLocaleString()}
                                        </th>
                                        <td className="px-6 py-4">{item.amount}</td>
                                        <td className="px-6 py-4">{item.reason}</td>
                                        <td className="px-6 py-4">
                                            {item.fileId ? (
                                                <button onClick={()=>handleReceiptDownload(item.fileId)} className="bg-transparent cursor-pointer hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded">
                                                    Download
                                                </button>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(currentMonth === item.month && currentYear === item.year) ? (
                                            <button onClick={()=>handleExpenseEdit(item)} className="bg-transparent cursor-pointer hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded">
                                                Edit
                                            </button>):""}
                                            <span className="px-2"></span>
                                            <button onClick={()=>handleReceiptDownload(item.fileId)} className="bg-transparent cursor-pointer hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-2 border border-red-500 hover:border-transparent rounded">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            {expensesLoading && (
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
                        <span className="mt-4 text-lg text-gray-700">Loading expense data...</span>
                    </div>
                </div>
            )}
            <Pagination
                totalExpenseCount={totalExpenseCount}
                currentPage={currentPage}
                onPageChange={onPageChange}
                pageSize={pageSize}
            />
            <ToastContainer />
        </div>
    )
}

export default ViewExpenses