import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
import { fetchMonthlyLimit } from './store/monthlyLimitSlice';


function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
        dispatch(fetchMonthlyLimit(userData.$id));
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])

  return !loading ? (
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
  ) : null
}

export default App
