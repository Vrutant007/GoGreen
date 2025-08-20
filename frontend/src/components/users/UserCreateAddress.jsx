import React, { useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import UserSideBar from './UserSideBar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, usertoken } from '../common/http'
import { toast } from 'react-toastify'

const UserCreateAddress = () => {
    const [addressList, SetAddressList] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const SaveAddress = async (data) => {
        const response = await fetch(`${apiUrl}/save-address`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${usertoken()}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200) {
                console.log(result);
                toast.success(result.message);
                SetAddressList(result.data);
                navigate('/account/address-list');
            }
        })
    }
  return (
    <>
    <Header/>
    <div className='container'>
      <div className='row'>
          <div className='d-flex justify-content-between mt-5 pb-3'>
              <h3 className='h3 pb-0 mb-0'>Add The Address</h3>
              <Link to='/account/address-list' className='btn btn-primary'>Back</Link>
          </div>
          {/*SideBar */}
          <div className='col-md-3'>
              <UserSideBar/>
          </div>
          {/*MainBar */}
          <div className='col-md-9'>
            <form action="" onSubmit={handleSubmit(SaveAddress)}>
              <div className='card shadow'>
              <div className="card-body p-4">
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>Label for The Purpose Address Eg. Home, Office, etc.</label>
                    <input
                    {
                        ...register("label", {
                            required: "The Label is required",
                        })
                    }
                    type="text" className={`form-control ${errors.label && 'is-invalid'}`} placeholder='Label'/>
                    {errors.label && <p className='invalid-feedback'>{errors.label?.message}</p>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>Receiver's Name</label>
                    <input
                    {
                        ...register("name", {
                            required: "The Name is required",
                        })
                    }
                    type="text" className={`form-control ${errors.name && 'is-invalid'}`} placeholder='Name'/>
                    {errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>Receiver's Email</label>
                    <input
                    {
                        ...register("email", {
                            required: "The Email is required",
                        })
                    }
                    type="email" className={`form-control ${errors.email && 'is-invalid'}`} placeholder='Email'/>
                    {errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>Phone No.</label>
                    <input
                    {
                        ...register("mobile", {
                            required: "The Mobile Number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Mobile number must be exactly 10 digits"
                            }
                        })
                    }
                    type="text" className={`form-control ${errors.mobile && 'is-invalid'}`} placeholder='Mobile Number'/>
                    {errors.mobile && <p className='invalid-feedback'>{errors.mobile?.message}</p>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>Address</label>
                    <input
                    {
                        ...register("address", {
                            required: "The Address is required",
                        })
                    }
                    type="text" className={`form-control ${errors.address && 'is-invalid'}`} placeholder='Address'/>
                    {errors.address && <p className='invalid-feedback'>{errors.address?.message}</p>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>City</label>
                    <input
                    {
                        ...register("city", {
                            required: "The City is required",
                        })
                    }
                    type="text" className={`form-control ${errors.city && 'is-invalid'}`} placeholder='City'/>
                    {errors.city && <p className='invalid-feedback'>{errors.city?.message}</p>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>State</label>
                    <input
                    {
                        ...register("state", {
                            required: "The State is required",
                        })
                    }
                    type="text" className={`form-control ${errors.state && 'is-invalid'}`} placeholder='State'/>
                    {errors.state && <p className='invalid-feedback'>{errors.state?.message}</p>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='form-label'>Zip Code</label>
                    <input
                    {
                        ...register("zip_code", {
                            required: "The Zip Code is required",
                        })
                    }
                    type="text" className={`form-control ${errors.zip_code && 'is-invalid'}`} placeholder='Zip Code'/>
                    {errors.zip_code && <p className='invalid-feedback'>{errors.zip_code?.message}</p>}
                </div>
              </div>
              </div>
              <button className='btn btn-primary mt-3 mb-5'>Create</button>
            </form>
          </div>
      </div>
    </div>
    <Footer/>
    </>
    
  )
}

export default UserCreateAddress