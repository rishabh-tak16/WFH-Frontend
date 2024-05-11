import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from '../pages/HomePage/HomePage'
import Registerpage from '../pages/RegisterPage/RegisterPage'
import Loginpage from '../pages/LoginPage/LoginPage'


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Registerpage />} />
        <Route path='/login' element={<Loginpage />} />
      </Routes>
    </BrowserRouter>
  )
}
