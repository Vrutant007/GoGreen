import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import SideBar from './SideBar'
import { admintoken, apiUrl } from '../common/http'
import Nostate from '../common/Nostate'
import { Link } from 'react-router-dom'

const ShowVendors = () => {
    const [vendor, SetVendors] = useState([]);
    const fetchVendors = async () => {
        const response = await fetch(`${apiUrl}/vendors`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                SetVendors(result.data);
                console.log(result.data)
            }else{
                console.log('Something Went Worng');
            }
             
        })
    }
    useEffect(()=>{
        fetchVendors();
    },[]);
  return (
    <>
    <Header/>
    <div className='container'>
      <div className='row'>
          <div className='d-flex justify-content-between mt-5 pb-3'>
              <h3 className='h3 pb-0 mb-0'>Vendors</h3>
              {/* <Link to='/admin/categories/create' className='btn btn-primary'>Create</Link> */}
          </div>
          {/*SideBar */}
          <div className='col-md-3'>
              <SideBar/>
          </div>
          {/*MainBar */}
          <div className='col-md-9 pb-4'>
              <div className='card shadow'>
              <div className="card-body p-4">
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Area</th>
                            <th>Pincode</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            vendor.length == 0 && <Nostate/> 
                        }
                        {
                            vendor.map(vendor => {
                                return(
                                    <tr>
                                        <td>
                                            <Link to={`/admin/${vendor.id}/show-vendors-orders`}>{vendor.id}</Link>
                                        </td>
                                        <td>{vendor.name}</td>
                                        <td>{vendor.email}</td>
                                        <td>{vendor.area}</td>
                                        <td>{vendor.pincode}</td>
                                        <td>
                                            {
                                                vendor.status == 'active' ? <span className="badge bg-success">Active</span>
                                                : <span className="badge bg-danger">Block</span>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
              </div>
              </div>
          </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default ShowVendors