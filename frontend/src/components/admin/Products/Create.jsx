import React, { useEffect, useState, useRef, useMemo } from 'react'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import { Link, useNavigate } from 'react-router-dom'
import SideBar from '../SideBar'
import { useForm } from 'react-hook-form'
import { admintoken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'
import JoditEditor from 'jodit-react';

const Create = ({ placeholder }) => {

  const [categories , SetCategotries] = useState([]);
  const [brands , SetBrands] = useState([])
  const [gallery , SetGallery] = useState([])
  const [galleryImages , SetGalleryImages] = useState([])
  const editor = useRef(null);
	const [content, setContent] = useState('');

	const config = useMemo(() => ({
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
			placeholder: placeholder || ''
		}),
		[placeholder]
	);

  const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm();

    const saveProducts = async(data) => {
        
        const formData = {...data,'description': content , 'gallery': gallery}
        //console.log(formData);
        //return;
        const response = await fetch(`${apiUrl}/products`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
                body: JSON.stringify(formData)
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                toast.success(result.message);
                navigate('/admin/products');
            }else{
              const fromErrors = result.errors;
                Object.keys(fromErrors).forEach((field)=>{
                  setError(field, {message: fromErrors[field][0] })
                })
                //console.log('Something Went Worng');
            }
             
        })
    }

    const fetchCategories = async() => {
        const response = await fetch(`${apiUrl}/categories`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${admintoken()}`
                },
        }).then(res => res.json())
        .then(result => {
          console.log(result);
          SetCategotries(result.data)
        })
    }

    const fetchBrands = async() => {
      const response = await fetch(`${apiUrl}/brands`,{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept' : 'application/json',
              'Authorization' : `Bearer ${admintoken()}`
              },
      }).then(res => res.json())
      .then(result => {
        console.log(result);
        SetBrands(result.data);
      })
    }

    const handleFile = async(e) => {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);

      const response = await fetch(`${apiUrl}/temp-images`,{
        method: 'POST',
        headers: {
            'Accept' : 'application/json',
            'Authorization' : `Bearer ${admintoken()}`
            },
            body: formData
          }).then(res => res.json())
          .then(result => {
            console.log(result);
            gallery.push(result.data.id);
            SetGallery(gallery);
            galleryImages.push(result.data.image_url)
            SetGalleryImages(galleryImages);
            e.target.value =''
        })
    }

    const deleteImage = (image) => {
      const NewGallery = galleryImages.filter(gallery => gallery != image)
      SetGalleryImages(NewGallery)
    }

    useEffect(() => {
      fetchCategories();
      fetchBrands();
    },[]);

  return (
    <>
      <Header/>
        <div className='container'>
          <div className='row'>
              <div className='d-flex justify-content-between mt-5 pb-3'>
                  <h3 className='h3 pb-0 mb-0'>Products</h3>
                  <Link to='/admin/products' className='btn btn-primary'>Back</Link>
              </div>
              {/*SideBar */}
              <div className='col-md-3'>
                  <SideBar/>
              </div>
              {/*MainBar */}
              <div className='col-md-9'>
                <form action="" onSubmit={handleSubmit(saveProducts)}>
                  <div className='card shadow'>
                      <div className="card-body p-4">
                          <div className='mb-3'>
                              <label htmlFor="" className='form-label'>Title</label>
                              <input
                              {
                                  ...register("title", {
                                      required: "The Title is required",
                                  })
                              }
                              type="text" className={`form-control ${errors.title && 'is-invalid'}`} placeholder='Title'/>
                              {errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>}
                          </div>
                          <div className='row'>
                            <div className='col-md-6'>
                              <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Category</label>
                                <select
                                  {
                                    ...register("category", {
                                        required: "Please Select a Category",
                                    })
                                  }
                                  className={`form-control ${errors.category && 'is-invalid'}`}>
                                  <option value="">Select Category</option>
                                  {
                                    categories && categories.map((category) => {
                                      return(
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                      )
                                    })
                                  }
                                </select>{errors.category && <p className='invalid-feedback'>{errors.category?.message}</p>}
                              </div>
                            </div>
                            <div className='col-md-6'>
                              <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Brand</label>
                                <select
                                {
                                  ...register("brand")
                                }
                                className='form-control'>
                                  <option value="">Select Brand</option>
                                  {
                                    brands && brands.map((brand) => {
                                      return(
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                      )
                                    })
                                  }
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className='mb-3'>
                            <label htmlFor="" className='form-label'>Short Description</label>
                            <textarea
                            {
                              ...register("short_description")
                            }
                            cols="30" rows="5" className='form-control' placeholder='Short Description'></textarea>
                          </div>
                          <div className='mb-3'>
                            <label htmlFor="" className='form-label'>Description</label>
                            <JoditEditor
                              ref={editor}
                              value={content}
                              config={config}
                              tabIndex={1} // tabIndex of textarea
                              onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons=
                            />
                          </div>

                          <h3 className='py-3 border-bottom mb-3'>Pricing</h3>

                          <div className='row mb-3'>
                            <div className='col-md-6'>
                              <label htmlFor="" className='form-label'>Price</label>
                              <input
                              {
                                ...register("price", {
                                    required: "Please Enter a Price",
                                })
                              }
                              type="text" placeholder='Price' className={`form-control ${errors.price && 'is-invalid'}`} />
                              {errors.price && <p className='invalid-feedback'>{errors.price?.message}</p>}
                            </div>
                            <div className='col-md-6'>
                              <label htmlFor="" className='form-label'>Discounted Price</label>
                              <input
                              {
                                ...register("compare_price")
                              }
                              type="text" placeholder='Discounted Price' className='form-control'/>
                            </div>
                          </div>

                          <h3 className='py-3 border-bottom mb-3'>Inventory</h3>

                          <div className='row mb-3'>
                            <div className='col-md-6'>
                              <label htmlFor="" className='form-label'>SKU</label>
                              <input
                              {
                                ...register("sku", {
                                    required: "Please Enter a SKU",
                                })
                              }
                              type="text" placeholder='SKU' className={`form-control ${errors.sku && 'is-invalid'}`}/>
                              {errors.sku && <p className='invalid-feedback'>{errors.sku?.message}</p>}
                            </div>
                            <div className='col-md-6'>
                              <label htmlFor="" className='form-label'>Barcode</label>
                              <input
                              {
                                ...register("barcode")
                              }
                              type="text" placeholder='Barcode' className='form-control'/>
                            </div>
                          </div>
                          
                          <div className='row mb-3'>
                            <div className='col-md-6'>
                              <label htmlFor="" className='form-label'>QTY</label>
                              <input
                              {
                                ...register("qty", {
                                    required: "Please Enter a Quantity",
                                })
                              }
                              type="text" placeholder='QTY' className={`form-control ${errors.qty && 'is-invalid'}`}/>
                              {errors.qty && <p className='invalid-feedback'>{errors.qty?.message}</p>}
                            </div>
                            <div className='col-md-6'>
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
                          </div>
                          <div>
                            <label htmlFor="" className='form-label'>Weight</label>
                            <input
                              {
                                ...register("weight", {
                                    required: "Please Enter a Weight",
                                })
                              }
                              type="text" placeholder='weight' className={`form-control ${errors.weight && 'is-invalid'}`}/>
                              {errors.weight && <p className='invalid-feedback'>{errors.weight?.message}</p>}
                          </div>
                          <div className='mb-3'>
                            <label htmlFor="" className='form-label'>Is Featured</label>
                                <select
                                  {
                                      ...register("is_featured", {
                                          required: "Please Select the Featured",
                                      })
                                  }
                                  className={`form-control ${errors.is_featured && 'is-invalid'}`}>
                                      
                                      <option value="1">Yes</option>
                                      <option value="2">No</option>
                                    
                                </select>{errors.is_featured && <p className='invalid-feedback'>{errors.is_featured?.message}</p>}
                          </div>
                          <h3 className='py-3 border-bottom mb-3'>Gallery</h3>
                          <div className='mb-3'>
                            <label htmlFor="" className='form-label'>Image</label>
                            <input
                            onChange={handleFile}
                            type="file" className='form-control'/>
                          </div>

                          <div className='mb-3'>
                            <div className='row'>
                              {
                                galleryImages && galleryImages.map((image,index) => {
                                  return (
                                    <div className='col-md-3' key={`image-${index}`}>
                                      <div className='card shadow'>
                                        <img src={image} alt="" className='w-100'/>
                                        
                                      </div>
                                      <button type='button' className='btn btn-danger mt-3 w-100' onClick={() => deleteImage(image)}>Delete</button>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                      </div>
                  </div>
                  <button className='btn btn-primary mt-3 mb-5'>Create</button>
                </form>
              </div>
          </div>
        </div>
      <Footer/>
    </>
  )
}

export default Create