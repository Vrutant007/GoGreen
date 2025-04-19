import React, { useState } from 'react'
import Header from '../../common/Header'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SideBar from '../SideBar'
import Footer from '../../common/Footer'
import { useForm } from 'react-hook-form'
import { admintoken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'

const Edit = () => {

    const navigate = useNavigate();
    const [brands, setBrands] = useState([])
    const params = useParams();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            const response = await fetch(`${apiUrl}/brands/${params.id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization' : `Bearer ${admintoken()}`
                    },
            }).then(res => res.json())
            .then(result => {
                console.log(result);
                if(result.status == 200){
                    setBrands(result.data);
                    reset({
                        name: result.data.name,
                        status: result.data.status,
                    })
                }else{
                    console.log('Something Went Worng');
                }
                 
            })
        }
    });

    const saveBrands = async(data) => {
        const response = await fetch(`${apiUrl}/brands/${params.id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
                body: JSON.stringify(data)
        }).then(res => res.json(data))
        .then(result => {
            if(result.status == 200){
                toast.success(result.message);
                navigate('/admin/brands');
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
                    <h3 className='h3 pb-0 mb-0'>Brands</h3>
                    <Link to='/admin/brands' className='btn btn-primary'>Back</Link>
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <SideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9'>
                    <div className='card shadow'>
                        <div className="card-body p-4">
                        <form action="" onSubmit={handleSubmit(saveBrands)}>
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
                            <button className='btn btn-primary mt-3'>Update</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default Edit