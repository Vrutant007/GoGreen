import React from 'react'
import SideBar from './SideBar'
import { Link } from 'react-router-dom'

const DashCommon = () => {
  return (
    <div className='container'>
      <div className='row'>
          <div className='d-flex justify-content-between mt-5 pb-3'>
              <h3 className='h3 pb-0 mb-0'>Categories</h3>
              <Link to='/admin/categories/create' className='btn btn-primary'>Create</Link>
          </div>
          {/*SideBar */}
          <div className='col-md-3'>
              <SideBar/>
          </div>
          {/*MainBar */}
          <div className='col-md-9'>
              <div className='card shadow'>
              <div className="card-body p-4"></div>
              </div>
          </div>
      </div>
  </div>
  )
}

export default DashCommon