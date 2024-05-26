import sysusericon from '../../atoms/sysuserimg.jpeg'
import orgusericon from '../../atoms/orguserimg.png'
import { useNavigate } from 'react-router-dom'
import MyDivider from '../../atoms/MyDivider/MyDivider'

import "./HomeContainer.molecule.scss"


export default function Homecontainer() {
    const navigate = useNavigate()
    return (
        <div className='homecontainer'>
            <h1>Welcome to WFH</h1>
            <div className='homebox'>
                <div className='sysbox' onClick={() => { navigate("/sys/login") }}>
                    <img src={sysusericon} alt="sysuser_icon" />
                    <h3>System User</h3>
                </div>
                <MyDivider />
                <div className='orgbox' onClick={() => { navigate("/org/login") }}>
                    <img src={orgusericon} alt="orguser_icon" />
                    <h3>Organisation User</h3>
                </div>
            </div>
        </div>
    )
}

