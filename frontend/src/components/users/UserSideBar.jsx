import React, { useContext } from 'react'
import { UserAuthContext } from '../context/UserAuth';
import { Link } from 'react-router-dom';

const UserSideBar = () => {

    const {logout} = useContext(UserAuthContext);

  return (
    <div className='card shadow mb-5 sidebar'>
        <div className='card-body p-4'>
            <ul>
                <li><Link to='/account/dash'>My Account</Link></li>
                <li><a href='/account/orders'>Orders</a></li>
                <li><a href='#'>Change Password</a></li>
                <li><a href='#' onClick={logout}>Logout</a></li>
            </ul>
        </div>  
    </div>  
  )
}

export default UserSideBar