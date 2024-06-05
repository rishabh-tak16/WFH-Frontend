import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from '../pages/HomePage/HomePage'
import SysRegisterpage from '../pages/SysRegisterPage/RegisterPage'
import SysLoginpage from '../pages/SysLoginPage/SysLoginPage'
import OrgRegisterPage from '../pages/OrgRegisterPage/OrgRegisterPage'
import OrgLoginPage from '../pages/OrgLoginPage/OrgLoginPage'
import SysDashboard from '../pages/SysDashboard/SysDashboard'
import OrgDashboard from '../pages/OrgDashboard/OrgDashboard'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        
        <Route path='/sys/register' element={<SysRegisterpage />} />
        <Route path='/sys/login' element={<SysLoginpage />} />
        <Route path='/sys/dashboard' element={<SysDashboard/>}/>
        
        <Route path='/org/register' element={<OrgRegisterPage/>} />
        <Route path='/org/login' element={<OrgLoginPage />} />
        <Route path='/org/dashboard' element={<OrgDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}
