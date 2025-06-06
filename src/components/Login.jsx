import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm()
  const [error, setError] = useState("")

  const login = async(data) => {
    setError("")
    try {
        const session = await authService.login(data)
        if (session) {
            const userData = await authService.getCurrentUser()
            //console.log("===LOGIN USER DATA===", userData);
            if(userData) dispatch(authLogin({userData}));
            navigate("/view-expenses")
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
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mx-100" onSubmit={handleSubmit(login)}>
              <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                  </label>
                  <input 
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? "border-red-500" : ""}`}
                      id="email" 
                      type="text" 
                      placeholder="Enter your email address" 
                      {...register("email", {
                          required: true,
                          validate: {
                              matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                              "Email address must be a valid address",
                          }
                      })}
                  />
                  {errors && errors.email && <p className="text-red-500 text-xs italic">Invalid email</p>}
              </div>
              <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      Password
                  </label>
                  <input 
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? "border-red-500" : ""}`}
                      id="password" 
                      type="password"
                      placeholder="Enter password" 
                      {...register("password", {
                          required: true,})}
                  />
                  {errors && errors.password && <p className="text-red-500 text-xs italic">Invalid password</p>}
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
                      Login
                  </button>
              </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
              &copy;2025 Acme Corp. All rights reserved.
          </p>
      </div>
  )
}

export default Login