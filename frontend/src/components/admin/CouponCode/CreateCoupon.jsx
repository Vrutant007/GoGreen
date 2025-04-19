import React, { useEffect } from 'react'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import { Link, useNavigate } from 'react-router-dom'
import SideBar from '../SideBar'
import { useForm } from 'react-hook-form'
import { admintoken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'

const CreateCoupon = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const saveCoupon = async(data) => {
        const response = await fetch(`${apiUrl}/store-coupon-code`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200) {
                toast.success(result.message);
                navigate('/admin/coupon-code');
            }else {
                console.log('Something Went Wrong');
            }
        })
    }
  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>Coupon Code</h3>
                    <Link to='/admin/coupon-code' className='btn btn-primary'>Back</Link>
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <SideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9'>
                    <form onSubmit={handleSubmit(saveCoupon)}>
                        <div className='card shadow'>
                            <div className='card body p-4'>
                                <div className='mb-3'>
                                    <label htmlFor="" className='form-label'>Coupon Code</label>
                                    <input
                                    {
                                        ...register("code", {
                                            required: "The Coupon Code is required",
                                        })
                                    }
                                    type="text" className={`form-control ${errors.code && 'is-invalid'}`} placeholder='Coupon Code'/>
                                    {errors.code && <p className='invalid-feedback'>{errors.code?.message}</p>}
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="" className='form-label'>Discount in %</label>
                                    <input
                                    {
                                        ...register("discount_amount", {
                                            required: "The Discount Field is required",
                                        })
                                    }
                                    type="number" className={`form-control ${errors.discount_amount && 'is-invalid'}`} placeholder='Discount in Percentage'/>
                                    {errors.discount_amount && <p className='invalid-feedback'>{errors.discount_amount?.message}</p>}
                                </div>
                                <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Coupon Valid Till</label>
                                    <input
                                    {
                                        ...register("expire_at")
                                    }
                                    type="date" className='form-control'/>
                                </div>
                            </div>
                        </div>
                        <button className='btn btn-primary mt-3'>Create</button>
                    </form>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default CreateCoupon