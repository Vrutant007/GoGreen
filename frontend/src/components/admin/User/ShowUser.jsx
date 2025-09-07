import React, { useEffect, useState } from 'react'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import SideBar from '../SideBar'
import { Link } from 'react-router-dom'
import { admintoken, apiUrl } from '../../common/http'

const ShowUser = () => {

    const [users , setUser] = useState([]);

    const fetchUsers = async() => {
        const response = await fetch(`${apiUrl}/users`,{
            method : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
            },
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                setUser(result.data);
                console.log(result.data);
            }
        })
    }

    useEffect(()=>{
        fetchUsers();
    },[])
  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>Users</h3>
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
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Zip Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users && users.map((user) => {
                                        return(
                                            <tr>
                                                <td>{user.user_id}</td>
                                                <td>{user.user_name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.mobile ? user.mobile : '----'}</td>
                                                <td>{user.city ? user.city : '----'}</td>
                                                <td>{user.state ? user.state : '----'}</td>
                                                <td>{user.zip_code ? user.zip_code : '----'}</td>
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

export default ShowUser