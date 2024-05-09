import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/homepage/homepage'
import Registerpage from './pages/registerpage/registerpage'
import Loginpage from './pages/loginpage/loginpage'


export default function AppRoutes() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/register' element={<Registerpage/>}/>
      <Route path='/login' element={<Loginpage/>}/>
    </Routes>
    </BrowserRouter>
  )
}
