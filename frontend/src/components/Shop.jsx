import React, { useEffect, useState } from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import ProductImg1 from '../assets/Products/healthy-8360076_1280.jpg';
import { Link, useSearchParams } from 'react-router-dom';
import { apiUrl } from './common/http';

const Shop = () => {
  const [categories, SetCategories] = useState([])
  const [brands, SetBrands] = useState([])
  const [products, SetProducts] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [catChecked, SetcatChecked] = useState(()=>{
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  })
  const [brandChecked, SetbrandChecked] = useState(()=>{
    const brand = searchParams.get('brand');
    return brand ? brand.split(',') : [];
  })
 


  const fetchCategories = () => {
    fetch(`${apiUrl}/get-categories`,{
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
      if(result.status == 200){
        //console.log(result);
        SetCategories(result.data)
      }else{
        console.log('Something went wrong');
      }
    })
  }

  const fetchBrands = () => {
    fetch(`${apiUrl}/get-brands`,{
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
      if(result.status == 200){
        //console.log(result);
        SetBrands(result.data)
      }else{
        console.log('Something went wrong');
      }
    })
  }

  const fetchProducts = () => {
    //console.log(catChecked)
    let search = [];
    let params = '';
    
    if (catChecked.length > 0){
      search.push(['category', catChecked])
    }

    if (brandChecked.length > 0){
      search.push(['brand', brandChecked])
    }

    if(search.length > 0){
      params = new URLSearchParams(search);
      setSearchParams(params)
    }else{
      setSearchParams([])
    }
    fetch(`${apiUrl}/get-products?${params}`,{
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
      if(result.status == 200){
        //console.log(result);
        SetProducts(result.data)
      }else{
        console.log('Something went wrong');
      }
    })
  }

  const handleCategories = (e) => {
    const {checked, value} = e.target;
    if(checked){
      SetcatChecked(pre => [...pre , value])
    }else{
      SetcatChecked(catChecked.filter(id => id !== value))
    }
  }

  const handleBrand = (e) => {
    const {checked, value} = e.target;
    if(checked){
      SetbrandChecked(pre => [...pre , value])
    }else{
      SetbrandChecked(brandChecked.filter(id => id !== value))
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  },[catChecked,brandChecked])
  return (
    <>
    <Header/>
      <div className='container-shop'>
        {/*BreadCrums */}
        <nav aria-label="breadcrumb" className='py-5'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page"><a href="/shop">Shop</a></li>
          </ol>
        </nav>
        {/*Sidebar */}
      <div className='row'>
        <div className='col-md-3'>
          <div className='card shadow border-0 mb-3'>
            <div className='card-body p-4'>
              <h3>Categories</h3>
              <ul>
                {
                  categories && categories.map(category => {
                    return(
                      <li key={`cat-${category.id}`} className='mb-2'>
                        <input checked={ searchParams.get('category') ? searchParams.get('category').includes(category.id) : false } type="checkbox" value={category.id} onChange={handleCategories}/>
                        <label htmlFor="" className='ps-2'>{category.name}</label>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>

          <div className='card shadow border-0 mb-3'>
            <div className='card-body p-4'>
              <h3>Brands</h3>
              <ul>
                {
                  brands && brands.map(brand => {
                    return(
                      <li  className='mb-2'>
                        <input checked={ searchParams.get('brand') ? searchParams.get('brand').includes(brand.id) : false } type="checkbox" value={brand.id} onChange={handleBrand}/>
                        <label htmlFor="" className='ps-2'>{brand.name}</label>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        {/*MainBar */}
        <div className='col-md-9'>
          <div className='row pb-5'>
            {
              products && products.map(product => {
                return(
                <div className='col-md-4 col-6'>
                  <div className='product card border-0'>
                    <div className='card-img'>
                      <Link to={`/product/${product.id}`}>
                        <img src={product.image_url} alt="" className='w-100'/>
                      </Link>
                    </div>
                    <div className='card-body'>
                      <Link to={`/product/${product.id}`}>{product.title}</Link>
                      <div className='price py-2'>
                          &#8377;{product.price} &nbsp;&nbsp;
                          {
                            product.compare_price && <span className='text-decoration-line-through'>&#8377;{product.compare_price}</span>
                          }
                          <br />per {product.weight}
                      </div> 
                    </div>
                  </div>
                </div>
              )
              })
            }
              
          </div>
        </div>
      </div>
      </div>
    <Footer/>
    </>
  )
}

export default Shop