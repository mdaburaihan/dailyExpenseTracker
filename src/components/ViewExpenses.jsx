import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"

function ViewExpenses() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm()
  const [error, setError] = useState("")

  const ViewExpenses = async(data) => {
    setError("")
    try {
        const session = await authService.login(data)
        if (session) {
            const userData = await authService.getCurrentUser()
            if(userData) dispatch(authLogin(userData));
            navigate("/")
        }
    } catch (error) {
        setError(error.message)
    }
  } 

  useEffect(() => {
      if (error) {
        const timeout = setTimeout(() => {
          setError('');
        }, 10000);
        return () => clearTimeout(timeout);
      }
  }, [error]);

  return (
      <div className="w-full mx-auto">
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mx-100" onSubmit={handleSubmit(addExpense)}>
              <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Enter Amount
                  </label>
                  <input 
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? "border-red-500" : ""}`}
                      id="amount" 
                      type="text" 
                      placeholder="Enter amount" 
                      {...register("email", {
                          required: true,
                          validate: {
                              matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                              "Email address must be a valid address",
                          }
                      })}
                  />
                  {errors && errors.email && <p className="text-red-500 text-xs italic">Invalid amount</p>}
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
          </form>
      </div>
  )
}

export default ViewExpenses