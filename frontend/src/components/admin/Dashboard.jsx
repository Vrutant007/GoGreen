import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import SideBar from './SideBar'
import { admintoken, apiUrl } from '../common/http'
import CountUp from 'react-countup';

const Dashboard = () => {
  const [UserCount, SetUserCount] = useState([]);
  const [OrderCount, SetOrderCount] = useState([]);
  const [ProductCount, SetProductCount] = useState([]);

  const fetchDashboardCount = async() =>{
    const response = fetch(`${apiUrl}/get-dash-count`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization' : `Bearer ${admintoken()}`
        },
    }).then(res => res.json())
    .then(result => {
        if(result.status == 200){
          SetUserCount(result.data.user);
          SetOrderCount(result.data.order);
          SetProductCount(result.data.product);

          console.log(result.data)
        }else{
          console.log('Something Went Worng');
        }
      })
  }

  useEffect(()=>{
    fetchDashboardCount();
  },[])
  return (
    <>
        <Header/>
        {/*<button className='btn btn-danger' onClick={logout}>Logout</button>*/}
        <div className='container'>
          <div className='row'>
            <div className='d-flex justify-content-between mt-5 pb-3'>
              <h3>Dashboard</h3>
            </div>
            {/*SideBar */}
            <div className='col-md-3'>
              <SideBar/>
            </div>
            {/*MainBar */}
            <div className='col-md-9'>
              <div className='row'>
                <div className='col-md-4'>
                <div className='card shadow'>
                  <div className='card-body'>
                    <h2><CountUp end={UserCount} duration={4} /></h2>
                    <span>User</span>
                  </div>
                  <div className='card-footer'>
                    <a href="/admin/users">View Users</a>
                  </div>
                </div>
                </div>
                <div className='col-md-4'>
                  <div className='card shadow'>
                    <div className='card-body'>
                      <h2><CountUp end={OrderCount} duration={4} /></h2>
                      <span>Order</span>
                    </div>
                    <div className='card-footer'>
                      <a href="/admin/orders">View Order</a>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                <div className='card shadow'>
                  <div className='card-body'>
                    <h2><CountUp end={ProductCount} duration={2} /></h2>
                    <span>Products</span>
                  </div>
                  <div className='card-footer'>
                    <a href="/admin/products">View Products</a>
                  </div>
                </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <Footer/>
    </>
  )
}

export default Dashboard