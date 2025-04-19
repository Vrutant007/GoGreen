import React, { useContext } from 'react'
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/http';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuth';

const Login = () => {
    const navigate = useNavigate(); 
    const {login} = useContext(AdminAuthContext);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);

        const res = await fetch(`${apiUrl}/admin/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
        .then(result => {
            console.log(result);

            if(result.status == 200){
                
                const adminInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name,
                }
                localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
                login(adminInfo)
                toast.success('Login Suceessfully');
                navigate('/admin/dash')
            }else{
                //toast.error(result.message);
                if (result.errors) { // ✅ Check if 'errors' exists
                    Object.keys(result.errors).forEach((field) => {
                        setError(field, { message: result.errors[field][0] });
                    });
                } else {
                    toast.error(result.message || "An error occurred"); // ✅ Show generic error message
                }
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
                        <h3>Admin Login</h3>
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
                        <button className='btn btn-secondary'>Login</button>
                    </div>
                </div>
            </form>
        </div>

        <Footer/>
    </>
  )
}

export default Login