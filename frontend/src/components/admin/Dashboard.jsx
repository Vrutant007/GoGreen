import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import SideBar from './SideBar'

const Dashboard = () => {
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
                    <h2>0</h2>
                    <span>User</span>
                  </div>
                  <div className='card-footer'>
                    <a href="">View Users</a>
                  </div>
                </div>
                </div>
                <div className='col-md-4'>
                  <div className='card shadow'>
                    <div className='card-body'>
                      <h2>0</h2>
                      <span>Order</span>
                    </div>
                    <div className='card-footer'>
                      <a href="">View Order</a>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                <div className='card shadow'>
                  <div className='card-body'>
                    <h2>0</h2>
                    <span>Products</span>
                  </div>
                  <div className='card-footer'>
                    <a href="">View Products</a>
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