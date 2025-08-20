import React, { useContext, useEffect, useState } from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import { Link, useNavigate } from 'react-router-dom'
import ProductImg1 from '../assets/Products/healthy-8360076_1280.jpg';
import { CartContext } from './context/Cart';
import { useForm } from 'react-hook-form';
import { apiUrl, usertoken } from './common/http';
import { toast } from 'react-toastify';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import UserAddresses from './common/UserAddresses';



const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentMethod, setpaymentMethod] = useState('cod');
    const {cartData, Delivery, grandTotal, subTotal, applyCoupon, removeCoupon, coupon, discount} = useContext(CartContext);
    const [couponCode, setCouponCode] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        mobile: ''
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm();

    const processOrder = (data) => {
        if(paymentMethod == 'stripe'){
            handleStripePayment(data);
        } else {
            saveOrder(data, 'not paid')
        }
    }

    const handlepaymentMethod = (e) => {
        setpaymentMethod(e.target.value)
    }

    const saveOrder = (formData, paymentStatus) => {
        const newformData = {...formData, 
            grand_total: grandTotal(),
            sub_total: subTotal(),
            delivery: Delivery(),
            discount: discount,
            payment_status: paymentStatus,
            status: 'pending',
            cart: cartData,
            coupon_code: coupon?.code || '',
            payment_method: paymentMethod,
            card_last_four: formData.card_last_four || null,
            address_id: selectedAddressId
        }
        fetch(`${apiUrl}/save-order`,{
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : `Bearer ${usertoken()}`

            },
            body : JSON.stringify(newformData)
        })
        .then(res => res.json())
        .then(result => {
            if(result.status == 200){
                localStorage.removeItem('cart');
                navigate(`/order/confirm/${result.id}`)
            }else{
                toast.error(result.message);
            }
            console.log(result)
        })
    }

    const handleStripePayment = async (formData) => {
        setLoading(true);
        const cardElement = elements.getElement(CardElement);
      
        // Step 1: Ask backend to create a payment intent
        const response = await fetch(`${apiUrl}/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken()}`
          },
          body: JSON.stringify({
            amount: grandTotal()
          })
        });
      
        const { clientSecret } = await response.json();
      
        // Step 2: Confirm the card payment using clientSecret
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
            },
          }
        });
      
        if (error) {
          toast.error(error.message);
          return;
        }
      
        if (paymentIntent.status === 'succeeded') {
            const last4 = paymentIntent?.charges?.data?.[0]?.payment_method_details?.card?.last4;
            const maskedCard = `XXXXXXXXXXXX${last4}`;
            saveOrder({ ...formData, card_last_four: maskedCard }, 'paid');
          }
        setLoading(false);
    };
    
    const fetchLastOrder = async () => {
        fetch(`${apiUrl}/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${usertoken()}`
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result.status === 200 && result.data) { 
                setValue("name", result.data.name || '');
                setValue("email", result.data.email || '');
                setValue("address", result.data.address || '');
                setValue("city", result.data.city || '');
                setValue("state", result.data.state || '');
                setValue("zip_code", result.data.zip_code || '');
                setValue("mobile", result.data.mobile || '');
           }
        })
    };

    // const handleInputChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };
    useEffect(() => {
        console.log('Coupon state:', coupon);
        fetchLastOrder();
    }, []);
  return (
    <>
        <Header/>
            <div className='container pb-5'>
                {/*BreadCrumbs*/}
                <div className='row'>
                    <div className='col-md-12'>
                    <nav aria-label="breadcrumb" className='py-5'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                {/*Billing Details*/}
                <form onSubmit={handleSubmit(processOrder)}>
                    <div className='row'>
                        
                        <div className='col-md-7'>
                            <h3 className='border-bottom pb-3'><strong>Billing Details</strong></h3>
                            {/* <div className='row pt-3'>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('name', {
                                                required: "The Name field is required",
                                            })
                                        }
                                        type="text" className={`form-control ${errors.name && 'is-invalid'}`} placeholder='Name' />
                                        {
                                            errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                        }
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('email', {
                                                required: "The Email field is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid Email Address'
                                                }
                                            })
                                        }
                                        type="text" className={`form-control ${errors.email && 'is-invalid'}`} placeholder='Email'/>
                                       {errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>}
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <textarea
                                    {
                                        ...register('address', {
                                            required: "The Address field is required",
                                        })
                                    }
                                    className={`form-control ${errors.address && 'is-invalid'}`} cols="30" rows="10" placeholder='Address'></textarea>
                                     {errors.address && <p className='invalid-feedback'>{errors.address?.message}</p>}
                                </div>

                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('city', {
                                                required: "The City field is required",
                                            })
                                        }
                                        type="text" className={`form-control ${errors.city && 'is-invalid'}`} placeholder='City' />
                                        {errors.city && <p className='invalid-feedback'>{errors.city?.message}</p>}
                                    </div>
                                </div>
                                
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('state', {
                                                required: "The State field is required",
                                            })
                                        }
                                        type="text"className={`form-control ${errors.state && 'is-invalid'}`} placeholder='State' />
                                        {errors.state && <p className='invalid-feedback'>{errors.state?.message}</p>}
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('zip_code', {
                                                required: "The Zip Code field is required",
                                            })
                                        }
                                        type="text" className={`form-control ${errors.zip_code && 'is-invalid'}`} placeholder='Zip'/>
                                        {errors.zip_code && <p className='invalid-feedback'>{errors.zip_code?.message}</p>}
                                    </div>
                                </div>
                                
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('mobile', {
                                                required: "The Mobile Number is required",
                                            })
                                        }
                                        type="text" className={`form-control ${errors.mobile && 'is-invalid'}`} placeholder='Mobile'/>
                                        {errors.mobile && <p className='invalid-feedback'>{errors.mobile?.message}</p>}
                                    </div>
                                </div>
                            </div> */}
                            <UserAddresses onSelect={(id) => setSelectedAddressId(id)}/>
                        </div>
                        <div className='col-md-5'>
                            <h3 className='border-bottom pb-3'><strong>Items</strong></h3>
                            <table className='table'>
                                <tbody>
                                    {
                                        cartData && cartData.map(item => {
                                            return (
                                                <tr>
                                                    <td width={120}>
                                                        <img src={item.image_url} width={100} alt="" />
                                                    </td>
                                                    <td width={600}>
                                                        <h4>{item.title}</h4>
                                                        <div className='d-flex align-items-center pt-3'>
                                                            <span>&#8377;{item.price} /{item.weight}</span>
                                                            <div className='ps-3'>X {item.qty}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    
                                </tbody>
                            </table>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='d-flex justify-content-between border-bottom pb-2'>
                                        <div>Subtotal</div>
                                        <div>&#8377;{subTotal()}</div>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom py-2'>
                                        <div>Delivery</div>
                                        <div>&#8377;{Delivery()}</div>
                                    </div>
                                    <div className='d-flex justify-content-between border-bottom py-2'>
                                        <div><strong>GrandTotal</strong></div>
                                        <div>&#8377;{grandTotal()}</div>
                                    </div>
                                    
                                    
                                    <h3 className='border-bottom pt-4 pb-3'><strong>Apply Coupon</strong></h3>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => {
                                                if (couponCode.trim() === '') {
                                                    toast.error('Please enter a coupon code');
                                                    return;
                                                }
                                                applyCoupon(couponCode);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {/* Show remove coupon button only if a coupon is active */}
                                    {couponCode.trim() !== '' && (
                                        <button 
                                            className="btn btn-sm btn-danger mt-2" 
                                            onClick={() => {
                                                removeCoupon();
                                                setCouponCode('');
                                            }}
                                        >
                                            Remove Coupon
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h3 className='border-bottom pt-4 pb-3'><strong>Payment Method</strong></h3>
                            <div>
                                <input type="radio"
                                name="payment_method" 
                                onClick={handlepaymentMethod}
                                defaultChecked={paymentMethod == 'stripe'} value={'stripe'}/>
                                <label htmlFor="" className='form-label ps-3'>Stripe</label>
                                {paymentMethod === 'stripe' && (
                                    <div className="my-3">
                                        <label className='form-label'><strong>Card Details</strong></label>
                                        <div className='border p-2 rounded'>
                                        <CardElement />
                                        </div>
                                    </div>
                                )}
                                <input type="radio"
                                name="payment_method" 
                                onClick={handlepaymentMethod}
                                defaultChecked={paymentMethod == 'cod'} value={'cod'} className='ms-3'/>
                                <label htmlFor="" className='form-label ps-3'>COD</label>
                            </div>
                            <div className='d-flex py-3'>
                                {/* <Link to={''}className='btn btn-primary'>Buy Now</Link> */}
                                <button className='btn btn-primary mt-3' disabled={loading}>
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                            
                        </div>
                        
                    </div>
                </form>
            </div>
        <Footer/>
    </>
   
  )
}

export default Checkout