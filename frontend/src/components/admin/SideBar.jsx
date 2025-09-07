import React, { useContext } from 'react'
import { AdminAuthContext } from '../context/AdminAuth'
import { Link } from 'react-router-dom';

const SideBar = () => {
    const {logout} = useContext(AdminAuthContext);
  return (
    
        <div className='card shadow mb-5 sidebar'>
            <div className='card-body p-4'>
                  <ul>
                    <li><Link to='/admin/dash'>Dashboard</Link></li>
                    <li><Link to='/admin/categories'>Categoies</Link></li>
                    <li><a href='/admin/brands'>Brands</a></li>
                    <li><a href='/admin/products'>Products</a></li>
                    <li><a href='/admin/orders'>Orders</a></li>
                    <li><a href='/admin/users'>Users</a></li>
                    <li><a href='/admin/show-vendors'>Vendors</a></li>
                    <li><a href='/admin/coupon-code'>Coupon Code</a></li>
                    <li><a href='/admin/change-password'>Change Password</a></li>
                    <li><a href='#' onClick={logout}>Logout</a></li>
                  </ul>
            </div>  
        </div>  
   
  )
}

export default SideBar