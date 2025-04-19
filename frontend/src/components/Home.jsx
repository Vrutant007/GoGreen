import React, { useEffect, useState } from 'react';

import Header from './common/Header';
import Footer from './common/Footer.jsx';
import { apiUrl } from './common/http.jsx';
import { Link } from 'react-router-dom';

const Home = () => {

  const [products , setProducts] = useState([]);
  const [featuredProducts , setFeaturedProducts] = useState([]);

  const latestProducts = async() => {
    const response = await fetch(apiUrl+'/get-latest-products',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        
        }
    })
    .then(res => res.json())
    .then(result => {
      console.log(result);
      setProducts(result.data);
    })

  }

  const featureProducts = async() => {
    const response = await fetch(apiUrl+'/get-featured-products',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        
        }
    })
    .then(res => res.json())
    .then(result => {
      console.log(result);
      setFeaturedProducts(result.data);
    })

  }
  useEffect(()=>{
    latestProducts()
    featureProducts()
  },[])
  return (
    <>
      <Header/>
        {/*Hero Section*/}
        <section className='section-1'>
            <div className='hero d-flex align-items-center'>
                <div className='container-fluid'>
                    <div></div>
                </div>
            </div>
        </section>

        {/*New Arrivals*/}
        <section className='section-2 py-5'>
          <div className='container'>
            <h2>New Arrivals</h2>
            <div className='row mt-4'>
              {
                products && products.map(product => {
                  return(
                    <div className='col-md-3'>
                      <div className='product card border-0'>
                        <div className='card-img'>
                        <Link to={`/product/${product.id}`}><img src={product.image_url} alt="" className='w-100'/></Link>
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
        </section>

        {/*Featured Products*/}
        <section className='section-2 py-5'>
          <div className='container'>
            <h2>Featured Products</h2>
            <div className='row mt-4'>
              {
                featuredProducts && featuredProducts.map(product => {
                  return(
                    <div className='col-md-3'>
                      <div className='product card border-0'>
                        <div className='card-img'>
                        <Link to={`/product/${product.id}`}><img src={product.image_url} alt="" className='w-100'/></Link>
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
        </section>
      <Footer/>
    </>
    
  )
}

export default Home