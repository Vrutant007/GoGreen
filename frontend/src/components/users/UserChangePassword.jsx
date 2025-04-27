import React, { useState } from 'react'
import { apiUrl, userId, usertoken } from '../common/http';
import { toast } from 'react-toastify';
import SideBar from '../admin/SideBar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import UserSideBar from './UserSideBar';

const UserChangePassword = () => {
    const id = userId();
    console.log(id);
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      const [loading, setLoading] = useState(false);
    
      const handleChange = (e) => {
        setFormData({ 
          ...formData, 
          [e.target.name]: e.target.value 
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await fetch(`${apiUrl}/change-password/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken()}`,
                },
                body: JSON.stringify({
                    current_password: formData.current_password,
                    new_password: formData.new_password,
                    confirm_password: formData.new_password_confirmation
                })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                toast.success(result.message || "Password changed successfully.");
                setFormData({
                  current_password: '',
                  new_password: '',
                  new_password_confirmation: ''
                });
            } else {
                // show backend error message properly
                toast.error(result.message || "Something went wrong.");
            }
    
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>User's Change Password</h3>
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <UserSideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9 pb-4'>
                <form onSubmit={handleSubmit}>
                    <div className='card shadow'>
                    
                        <div className="card-body p-4">
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Current Password</label>
                                <input 
                                    type="password" 
                                    name="current_password" 
                                    className="form-control" 
                                    value={formData.current_password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label'>New Password</label>
                                <input 
                                type="password" 
                                name="new_password" 
                                className="form-control" 
                                value={formData.new_password}
                                onChange={handleChange}
                                required
                                />
                            </div>

                            <div className='mb-3'>
                                <label className='form-label'>Confirm New Password</label>
                                <input 
                                type="password" 
                                name="new_password_confirmation" 
                                className="form-control" 
                                value={formData.new_password_confirmation}
                                onChange={handleChange}
                                required
                                />
                            </div>
                        </div>
                        
                    </div>
                    <button type="submit" className='btn btn-primary mt-3' disabled={loading}>
                            {loading ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default UserChangePassword