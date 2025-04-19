import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../common/http';

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);

        const res = await fetch(`${apiUrl}/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
        .then(result => {
            console.log(result);

            if(result.status == 200){
                toast.success(result.message);
                navigate('/account/login')
            }else{
                toast.error(result.message);
            }

        })
    }
  return (
    <>
        <Header/>
            <div className='container d-flex justify-content-center py-5'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='card shadow border-0 login'>
                        <div className='card-body p-4'>
                            <h3 className='border-bottom pb-2 mb-3'>User Registration</h3>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Name</label>
                                <input 
                                {
                                    ...register('name',{
                                        required: 'The Name field is required.',
                                        
                                    })
                                }
                                type="text" className={`form-control ${errors.name && 'is-invalid'}`} placeholder='Name'/>{errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Email</label>
                                <input 
                                {
                                    ...register('email',{
                                        required: 'The Email field is required.',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid Email Address'
                                        }
                                    })
                                }
                                type="text" className={`form-control ${errors.email && 'is-invalid'}`} placeholder='Email'/>{errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Password</label>
                                <input 
                                {
                                    ...register('password',{
                                        required: 'The Password field is required.',
                                    })
                                }
                                type="password" className={`form-control ${errors.password && 'is-invalid'}`} placeholder='Password'/>{errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>}
                            </div>
                            <button className='btn btn-secondary w-100'>Register</button>

                            <div className='d-flex justify-content-center pt-4 pb-2'>
                                Already have an account? &nbsp; <Link to="/account/login">Login</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        <Footer/>
    </>
  )
}

export default Register