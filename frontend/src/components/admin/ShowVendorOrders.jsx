import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import SideBar from './SideBar'
import { Link, useParams } from 'react-router-dom'
import { admintoken, apiUrl } from '../common/http'

const ShowVendorOrders = () => {
    const [vendorOrders, SetVendorsOrders] = useState([]);
    const params = useParams();

    const fetchVendorsOrders = async () => {
        const response = await fetch(`${apiUrl}/vendors/${params.id}/orders`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                SetVendorsOrders(result.data);
                console.log(result.data)
            }else{
                console.log('Something Went Worng');
            }
              
        })
    }

    useEffect(()=>{
        fetchVendorsOrders();
    },[]);
  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>Vendor Orders List</h3>
                    {/* <Link to='/admin/categories/create' className='btn btn-primary'>Create</Link> */}
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <SideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9'>
                    <div className='card shadow'>
                    <div className="card-body p-4">
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer ID</th>
                                    <th>Customer Name</th>
                                    <th>Customer Email</th>
                                    <th>Customer Area</th>
                                    <th>Customer ZipCode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    vendorOrders && vendorOrders.map((order) => {
                                        return(
                                            <tr key={order.id}>
                                                <td>
                                                    <Link to = {`/admin/orders/${order.id}`}>{order.id}</Link>
                                                </td>
                                                <td>{order.user_id}</td>
                                                <td>{order.address.name}</td>
                                                <td>{order.address.email}</td>
                                                <td>{order.address.area}</td>
                                                <td>{order.address.zip_code}</td>
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

export default ShowVendorOrders