import React from 'react'
import sysusericon from '../../atoms/sysuserimg.jpeg'
import orgusericon from '../../atoms/orguserimg.png'
import { useNavigate } from 'react-router-dom'

import './homepage.scss'

export default function Homepage() {
    const navigate = useNavigate()
    return (
        <div className='homecontainer'>
            <h1>Welcome to WFH</h1>
            <div className='homebox'>
                <div className='sysbox' onClick={()=>{navigate("/register")}}>
                    <img src={sysusericon} alt="sysuser_icon" />
                    <h3>System User</h3>
                </div>
                <div className='orgbox' onClick={()=>{navigate("/register")}}>
                    <img src={orgusericon} alt="orguser_icon" />
                    <h3>Organisation User</h3>
                </div>
            </div>
        </div>
    )
}
