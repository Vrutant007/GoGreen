import React, { useEffect, useState } from 'react'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import SideBar from '../SideBar'
import { Link, useParams } from 'react-router-dom'
import { admintoken, apiUrl } from '../../common/http'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const OrderDetail = () => {

    const [orders, SetOrder] = useState([]);
    const [items, setItems] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const params = useParams();

    const fetchOrders = async () => {
        const response = await fetch(`${apiUrl}/order/${params.id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                SetOrder(result.data);
                setItems(result.data.items);
                reset({
                    status: result.data.status,
                    payment_status: result.data.payment_status,
                })
                console.log(result.data);
            }else{
                console.log('Something Went Worng');
            }
             
        })
    }
    const updateOrder = async (data) => {
        const response = await fetch(`${apiUrl}/update-order/${params.id}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
                body: JSON.stringify(data),
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                SetOrder(result.data);
                reset({
                    status: result.data.status,
                    payment_status: result.data.payment_status,
                })
                toast.success(result.message);
                console.log(result.data);
            }else{
                console.log('Something Went Worng');
            }
        })
    }
    

    useEffect(() => {
        fetchOrders(); 
    },[])

  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row mb-5'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>Order Details</h3>
                    <Link to='/admin/orders' className='btn btn-primary'>Back</Link>
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <SideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9'>
                    <div className='row'>
                        {/* For Main details */}
                        <div className='col-md-9'>
                            <div className='card shadow'>
                                <div className="card-body p-4">
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <h3>Order ID: <strong>#{orders.id}</strong></h3>
                                            {
                                                orders.status == 'pending' && <span className='badge bg-warning'> Pending</span> 
                                            }
                                            {
                                                orders.status == 'delivered' && <span className='badge bg-success'> Delivered</span> 
                                            }
                                            {
                                                orders.status == 'cancelled' && <span className='badge bg-warning'> Cancelled</span> 
                                            }
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='text-secondary'>Date</div>
                                            <h4 className='pt-2'>{orders.created_at}</h4>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='text-secondary'>Patment Status</div>
                                            {
                                                orders.payment_status
                                                    ? orders.payment_status === 'not paid'
                                                        ? <span className="badge bg-danger">Not Paid</span>
                                                        : <span className="badge bg-success">Paid</span>
                                                    : <span className="badge bg-secondary">Unknown</span>
                                            }
                                        </div>
                                    </div>  
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <div className='py-5'>
                                                <strong>{orders.address?.name}</strong>
                                                <div>{orders.address?.email}</div>
                                                <div>{orders.address?.mobile}</div>
                                                <div>
                                                {orders.address?.address}, {orders.address?.area}, {orders.address?.city}, {orders.address?.state}, {orders.address?.zip_code}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='text-secondary pt-5'>Patment Method</div>
                                            <p>COD</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <h3 className="pb-2 "><strong>Items</strong></h3>
                                        {
                                            items.map((item) =>{
                                                return(
                                                    <div className="row justify-content-end">
                                                        <div className="col-lg-12">
                                                            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                <div className="d-flex">
                                                                {
                                                                    item.product.image && <img width="70" className="me-3" src={`${item.product.image_url}`} alt=""/>
                                                                }
                                                                    
                                                                    <div className="d-flex flex-column">
                                                                        <div className="mb-2">{item.name}</div>
                                                                        {/* <div><button class="btn btn-size">L</button></div> */}
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex">
                                                                    <div>X{item.qty}</div>
                                                                    <div className="ps-3">&#8377;{item.price}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                        <div className="row justify-content-end">
                                            <div className="col-lg-12">
                                                <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                    <div>Subtotal</div>
                                                    <div>&#8377;{orders.sub_total}</div>
                                                </div>
                                                <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                    <div>Shipping</div>
                                                    <div>&#8377;{orders.delivery}</div>
                                                </div>
                                                <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                    <div><strong>Grand Total</strong></div>
                                                    <div>&#8377;{orders.grand_total}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* For Change Status */}
                        <div className='col-md-3'>
                            <div className='card shadow'>
                                <div className="card-body p-4">
                                    <form onSubmit={handleSubmit(updateOrder)}>
                                        <div className='mb-3'>
                                            <label className="form-label">Status</label>
                                            <select
                                            {
                                                ...register('status', {required: true})
                                            }
                                            className="form-select" id="status">
                                                <option value="pending">Pending</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className='mb-3'>
                                            <label className="form-label">Payment Status</label>
                                            <select
                                            {
                                                ...register('payment_status', {required: true})
                                            }
                                            className="form-select" id="status">
                                                <option value="paid">Paid</option>
                                                <option value="not paid">Not Paid</option>
                                            </select>
                                        </div>
                                        <button type='submit' className='btn btn-primary'>Update</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default OrderDetail