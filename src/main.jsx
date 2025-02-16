import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Signup from './components/SignUp.jsx'
import Login from './components/Login.jsx'
import AddExpense from './components/AddExpense.jsx'
import ViewExpenses from './components/ViewExpenses.jsx'
import MonthlyLimit from './components/MonthlyLimit.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/monthly-limit",
        element: <MonthlyLimit />,
      },
      {
        path: "/view-expenses",
        element: <ViewExpenses />,
      },
      {
        path: "/add-expense",
        element: <AddExpense />,
      }
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
