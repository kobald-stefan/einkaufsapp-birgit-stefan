import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import Expenses from './pages/Expenses'
import Month from './pages/Month'
import Settings from './pages/Settings'
import EditExpense from './pages/EditExpense'
import Shopping from './pages/Shopping'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'add', element: <AddExpense /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'month', element: <Month /> },
      { path: 'settings', element: <Settings /> },
      { path: 'edit/:id', element: <EditExpense /> },
      { path: 'shopping', element: <Shopping /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
