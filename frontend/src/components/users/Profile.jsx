import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import { Link } from 'react-router-dom'
import UserSideBar from './UserSideBar'

const Profile = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem('userInfo'); // or whatever key you used
        if (storedData) {
          const user = JSON.parse(storedData);
          setUserName(user.name || 'Guest');
        }
      }, []);
  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>My Account</h3>
                    {/* <Link to='/admin/categories/create' className='btn btn-primary'>Create</Link> */}
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <UserSideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9'>
                    <div className='card shadow'>
                    <div className="card-body p-4">
                        <h3 className='mb-3'>Welcome, {userName}</h3>
                        <p className='text-muted'>
                            Here's your personal space where you can see your orders and stay in control. We're glad you're here!
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default Profile