import React, { useContext, useEffect, useState } from 'react'
import Header from './common/Header'
import Footer from './common/Footer'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Rating } from 'react-simple-star-rating'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Navigation  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import ProductImg1 from '../assets/Products/healthy-8360076_1280.jpg';
import { apiUrl } from './common/http';
import { CartContext } from './context/Cart';
import { toast } from 'react-toastify';

const Product = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [rating, setRating] = useState(4);
    const [product , SetProduct] = useState([]);
    const [productImages , SetProductImages] = useState([]);
    const params = useParams();
    const { addToCart } = useContext(CartContext)

    const fetchProduct = () => {
        fetch(`${apiUrl}/get-product/${params.id}`,{
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
          if(result.status == 200){
            //console.log(result);
            SetProduct(result.data)
            SetProductImages(result.data.product_images)
          }else{
            console.log('Something went wrong');
          }
        })
    }

    const handleAddToCart = () => {
        addToCart(product)
        toast.success("Product Added to Cart Successfully");
    }

    useEffect(() => {
        fetchProduct();
    },[])
  return (
    <>
        <Header/>
            <div className="container product-detail">
                {/*BreadCrumbs*/}
                <div className='row'>
                    <div className='col-md-12'>
                        <nav aria-label="breadcrumb" className='py-5'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item " aria-current="page"><Link to="/shop">Shop</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                
                <div className="row mb-5">
                    {/*Side Bar */}
                    <div className="col-md-5">
                        <div className='row'>
                            <div className='col-2'>
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    onSwiper={setThumbsSwiper}
                                    loop={true}
                                    direction={`vertical`}
                                    spaceBetween={10}
                                    slidesPerView={6}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper mt-2"
                                >
                                    {
                                        productImages && productImages.map(product_image => {
                                            return (
                                                <SwiperSlide key={`image-${product_image.id}`}>
                                                    <div className='content'>
                                                        <img 
                                                            src={product_image.image_url} 
                                                            alt="" 
                                                            height={100}
                                                            className='w-100' />
                                                    </div>                                                                      
                                                </SwiperSlide>
                                            )
                                        })
                                    }
                                </Swiper>

                            </div>
                            <div className='col-10'>
                                <Swiper
                                    style={{
                                    '--swiper-navigation-color': '#000',
                                    '--swiper-pagination-color': '#000',
                                    }}
                                    loop={true}
                                    spaceBetween={0}
                                    navigation={true}
                                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper2"
                                >
                                    {
                                        productImages && productImages.map(product_image => {
                                            return (
                                                <SwiperSlide key={`image-${product_image.id}`}>
                                                    <div className='content'>
                                                        <img 
                                                            src={product_image.image_url} 
                                                            alt="" 
                                                            className='w-100' />
                                                    </div>                                                                      
                                                </SwiperSlide>
                                            )
                                        })
                                    }         
                                </Swiper>
                            </div>
                        </div>{/*Swiper Ends*/}
                    </div>
                    {/*Main Bar */}
                    <div className='col-md-7'>
                        <h2>{product.title}</h2>
                        <div className='d-flex'>
                            <Rating
                                size={20}
                                readonly
                                initialValue={rating}
                            />
                            <span className='pt-1 ps-2'>10 Reviews</span>
                        </div>
                        <div className='price'>
                          &#8377;{product.price} &nbsp;&nbsp;
                          {
                            product.compare_price && <span className='text-decoration-line-through'>&#8377;{product.compare_price}</span>
                          }&nbsp;&nbsp;/{product.weight}
                        </div>
                        <div>
                            {product.short_description}
                        </div>
                        <div className='add-to-cart py-3 my-4'>
                            <button
                             onClick={handleAddToCart}
                            className='btn btn-primary text-uppercase'>Add To Cart</button>
                        </div>
                        <hr />
                        <div>
                            <strong>SKU: </strong>
                            {product.sku}
                        </div>
                    </div>
                </div>
                
                <div className='row pb-5'>
                    <div className='col-md-12'>
                        <Tabs
                            defaultActiveKey="Description"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                            >
                            <Tab eventKey="Description" title="Description">
                                <div dangerouslySetInnerHTML={{__html:product.description}} >

                                </div>
                            </Tab>
                            <Tab eventKey="Reviews" title="Reviews (10)">
                                Reviews
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        <Footer/>
    </>
  )
}

export default Product