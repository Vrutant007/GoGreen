import React, { useEffect, useState } from 'react'
import Footer from './common/Footer'
import Header from './common/Header'
import { apiUrl, usertoken } from './common/http';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '../assets/Products/Go Green.png';

const Confirmation = () => {

  const [order, setOrder] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const fetchOrder = () =>{
    fetch(`${apiUrl}/get-order-details/${params.id}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
        'Authorization' : `Bearer ${usertoken()}`
      }
    })
    .then(res => res.json())
    .then(result => {
      setLoading(false)
      if(result.status == 200){
        setOrder(result.data);
        setItems(result.data.items);
      }else{
        setOrder(null);
        toast.error(result.message)
      }
    })
  }

  const generatePdf = () => {
    const doc = new jsPDF();
 
    const img = new Image();
    img.src = Logo;
    img.onload = function () {
      doc.addImage(img, "PNG", 10, 10, 30, 30);
  
      doc.setFontSize(20);
      doc.text("Order Invoice", 80, 20);
  
      doc.setFontSize(12);
      doc.text(`Order ID: #${order.id}`, 10, 50);
      doc.text(`Order Date: ${order.created_at}`, 10, 60);
      doc.text(`Customer Name: ${order.name}`, 10, 70);
      doc.text(`Address: ${order.address}, ${order.city}, ${order.state}, ${order.zip_code}`, 10, 80);
      doc.text(`Contact No.: ${order.mobile}`, 10, 90);

      const tableData = items.map((item) => [
        item.name,
        item.qty,
        item.unit_price,
        item.price
      ]);
  
      autoTable(doc, {
        startY: 100,
        head: [['Product Name', 'Quantity', 'Unit Price', 'Price']],
        body: tableData,
      });
  
      let finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Sub Total: ${order.sub_total}`, 150, finalY);
      doc.text(`Delivery: ${order.delivery}`, 150, finalY + 10);
      doc.text(`Grand Total: ${order.grand_total}`, 150, finalY + 20);
  
      doc.save(`Invoice_${order.id}_${order.name}.pdf`);
    };
  }

  useEffect(() => {
    fetchOrder();
  },[])

  return (
    <>
        <Header/>
            <div className="container py-5">
              {
                loading === true && 
                <div className='text-center py-5'>
                  <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                </div>
              }
              {
                loading === false && order &&
                <div>
                  <div className="row">
                      <h1 className='text-center fw-bold text-success'>Thank You</h1>
                      <p className='text-muted text-center'>Your Order has been Successfully Placed !</p>
                  </div>
                  <div className='card shadow'>
                    <div className='card-body'>
                      <h5 className='card-title fw-bold'>Order Summary</h5><hr />
                      <div className='row'>
                        <div className='col-md-6'>
                          <p><strong>Order ID :</strong> #{order.id}</p>
                          <p><strong>Order Date :</strong> {order.created_at}</p>
                          <p><strong>Status :</strong>&nbsp;
                            {
                              order.status == 'pending' && <span className='badge bg-warning'> Pending</span> 
                            }
                            {
                              order.status == 'delivered' && <span className='badge bg-success'> Delivered</span> 
                            }
                            {
                              order.status == 'cancelled' && <span className='badge bg-warning'> Cancelled</span> 
                            }
                          </p>
                          <p><strong>Payment Method :</strong> {order.payment_status === 'paid' ? 'CARD' : 'COD'}</p>
                        </div>
                        <div className='col-md-6'>
                          <p><strong>Customer :</strong> {order.name}</p>
                          <p><strong>Address :</strong> {order.address}, {order.city}, {order.state}, {order.zip_code}</p>
                          <p><strong>Contant :</strong> {order.mobile}</p>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12'>
                          <table className="table-striped table-bordered table">
                            <thead className='table-light'>
                              <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th width="120">Price</th>
                                <th width="120">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                items.map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.qty}</td>
                                    <td>&#8377;{item.unit_price}</td>
                                    <td>&#8377;{item.price}</td>
                                  </tr>
                                ))
                              }
                              
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} className='text-end fw-bold'>Sub Total : </td>
                                <td>{order.sub_total}</td>
                              </tr>
                              <tr>
                                <td colSpan={3} className='text-end fw-bold'>Delivery : </td>
                                <td>{order.delivery}</td>
                              </tr>
                              <tr>
                                <td colSpan={3} className='text-end fw-bold'>Grand Total : </td>
                                <td>{order.grand_total}</td>
                              </tr> 
                            </tfoot>
                          </table>
                        </div>
                        <div className='text-center'>
                          <button className='btn btn-primary' onClick={generatePdf}>Download Invoice</button>
                          <Link to={'/'} className='btn btn-outline-secondary ms-3'>Continue Shopping</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {
                loading === false && !(order) &&
                <div className='row'>
                  <h1 className='text-center fw-bold text-muted'>Order Not Found</h1>
                </div>
              }
            </div>
        <Footer/>
    </>
  )
}

export default Confirmation