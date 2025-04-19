import React from 'react'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import SideBar from '../SideBar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { admintoken, apiUrl } from '../../common/http'

const Create = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const saveCategories = async(data) => {
        console.log(data);
        const response = await fetch(`${apiUrl}/categories`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
                body: JSON.stringify(data)
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                toast.success(result.message);
                navigate('/admin/categories');
            }else{
                console.log('Something Went Worng');
            }
             
        })
    }

  return (
    <>
        <Header/>
            <div className='container'>
                <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>Categories</h3>
                    <Link to='/admin/categories' className='btn btn-primary'>Back</Link>
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <SideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9'>
                    <form action="" onSubmit={handleSubmit(saveCategories)}>
                        <div className='card shadow'>
                            <div className="card-body p-4">
                                <div className='mb-3'>
                                    <label htmlFor="" className='form-label'>Name</label>
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
                                    <label htmlFor="" className='form-label'>Status</label>
                                    <select
                                    {
                                        ...register("status", {
                                            required: "Please Select the Status",
                                        })
                                    }
                                    className={`form-control ${errors.status && 'is-invalid'}`}>
                                        
                                        <option value="">Select a Status</option>
                                        <option value="1">Active</option>
                                        <option value="2">Block</option>
                                        
                                    </select>{errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>}
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

export default Create