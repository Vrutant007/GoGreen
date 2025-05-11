import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/admin/Login'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'
import {default as ShowCategories} from './components/admin/Category/Show'
import {default as CreateCategories} from './components/admin/Category/Create'
import {default as EditCategories} from './components/admin/Category/Edit'
import {default as ShowBrands} from './components/admin/Brands/Show'
import {default as CreateBrands} from './components/admin/Brands/Create'
import {default as EditBrands} from './components/admin/Brands/Edit'
import {default as ShowProducts} from './components/admin/Products/Show'
import {default as CreateProducts} from './components/admin/Products/Create'
import {default as EditProducts} from './components/admin/Products/Edit'
import Register from './components/users/Register'
import {default as UserLogin} from './components/users/Login'
import Profile from './components/users/Profile'
import { UserRequireAuth } from './components/users/UserRequireAuth'
import Confirmation from './components/Confirmation'
import ShowOrder from './components/admin/Orders/ShowOrder'
import ShowUser from './components/admin/User/ShowUser'
import UsersOrderList from './components/users/UsersOrderList'
import OrderDetail from './components/admin/Orders/OrderDetail'
import ShowCoupon from './components/admin/CouponCode/ShowCoupon'
import CreateCoupon from './components/admin/CouponCode/CreateCoupon'
import EditCoupon from './components/admin/CouponCode/EditCoupon'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ChangePassword from './components/admin/ChangePassword'
import UserChangePassword from './components/users/UserChangePassword'
import UserAddresses from './components/common/UserAddresses'
import UserListAddress from './components/users/UserListAddress'
import UserCreateAddress from './components/users/UserCreateAddress'
import UserEditAddress from './components/users/UserEditAddress'



const stripePromise = loadStripe("pk_test_51QqEGsFPl466N21zAF0dPPxLJMIorBlFAc4J1aPyOgZxvQt7yAOfhyahuKqp72OWrOtcYls1HtUXm6jSBOoeFpTA00mRWa9y9m");

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/shop' element={<Shop/>}/> 
          <Route path='/product/:id' element={<Product/>}/> 
          <Route path='/cart' element={<Cart/>}/>
          {/* <Route path='/checkout' element={<Checkout/>}/>  */}
          <Route path='/account/register' element={<Register/>}/> 
          <Route path='/account/login' element={<UserLogin/>}/>
          <Route path='/account/dash' element={
            <UserRequireAuth>
              <Profile/>
            </UserRequireAuth>}/>

            <Route path='/account/orders' element={
            <UserRequireAuth>
              <UsersOrderList/>
            </UserRequireAuth>}/>

          <Route path='/checkout' element={
            <Elements stripe={stripePromise}>
              <UserRequireAuth>
                <Checkout/>
              </UserRequireAuth>
            </Elements>}/>  

            <Route path='/order/confirm/:id' element={
            <UserRequireAuth>
              <Confirmation/>
            </UserRequireAuth>}/> 

            <Route path='/account/change-password' element={
            <UserRequireAuth>
              <UserChangePassword />
            </UserRequireAuth>}/>

            <Route path='/account/address/:id' element={
            <UserRequireAuth>
              <UserAddresses/>
            </UserRequireAuth>}/>

            <Route path='/account/address-list' element={
            <UserRequireAuth>
              <UserListAddress/>
            </UserRequireAuth>}/>

            <Route path='/account/add-address' element={
            <UserRequireAuth>
              <UserCreateAddress/>
            </UserRequireAuth>}/>

            <Route path='/account/edit-address/:id' element={
            <UserRequireAuth>
              <UserEditAddress/>
            </UserRequireAuth>}/>


          {/*Admin Routes */}

          <Route path='/admin/login' element={<Login/>}/> 
          <Route path='/admin/dash' element={
            <AdminRequireAuth>
              <Dashboard/>
            </AdminRequireAuth>
          }/>
          <Route path='/admin/categories' element={
            <AdminRequireAuth>
              <ShowCategories/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/categories/create' element={
            <AdminRequireAuth>
              <CreateCategories/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/categories/edit/:id' element={
            <AdminRequireAuth>
              <EditCategories/>
            </AdminRequireAuth>
          }/> 
           <Route path='/admin/brands' element={
            <AdminRequireAuth>
              <ShowBrands/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/brands/create' element={
            <AdminRequireAuth>
              <CreateBrands/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/brands/edit/:id' element={
            <AdminRequireAuth>
              <EditBrands/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/products' element={
            <AdminRequireAuth>
              <ShowProducts/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/products/create' element={
            <AdminRequireAuth>
              <CreateProducts/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/products/edit/:id' element={
            <AdminRequireAuth>
              <EditProducts/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/orders' element={
            <AdminRequireAuth>
              <ShowOrder/>
            </AdminRequireAuth>
          }/>
          <Route path='/admin/orders/:id' element={
            <AdminRequireAuth>
              <OrderDetail/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/users' element={
            <AdminRequireAuth>
              <ShowUser/>
            </AdminRequireAuth>
          }/>
          <Route path='/admin/coupon-code' element={
            <AdminRequireAuth>
              <ShowCoupon/>
            </AdminRequireAuth>
          }/> 
          <Route path='/admin/coupon-code/create' element={
            <AdminRequireAuth>
              <CreateCoupon/>
            </AdminRequireAuth>
          }/>
          <Route path='/admin/coupon-code/edit/:id' element={
            <AdminRequireAuth>
              <EditCoupon/>
            </AdminRequireAuth>
          }/>
          <Route path='/admin/change-password' element={
            <AdminRequireAuth>
              <ChangePassword/>
            </AdminRequireAuth>
          }/>
        </Routes>      
      </BrowserRouter>   
      <ToastContainer />  
    </>
  )
}

export default App
