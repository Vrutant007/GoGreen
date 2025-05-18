import React, { useEffect, useState } from 'react'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import SideBar from '../SideBar'
import { Link } from 'react-router-dom'
import { admintoken, apiUrl } from '../../common/http'
import * as XLSX from 'xlsx';

const ShowOrder = () => {

    const [orders, SetOrder] = useState([]);

    const fetchOrders = async () => {
        const response = await fetch(`${apiUrl}/orders`,{
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
                console.log(result.data)
            }else{
                console.log('Something Went Worng');
            }
             
        })
    }

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(orders.map(order => ({
            ID: order.id,
            Customer: order.name,
            Email: order.email,
            Amount: order.grand_total,
            Date: order.created_at,
            Payment_Status: order.payment_status,
            Order_Status: order.status
        })));
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    
        // Get current date and time
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB').split('/').reverse().join('-');
        const timeStr = now.toLocaleTimeString('en-GB').replace(/:/g, '-');
        
        const filename = `Orders_Report_${dateStr}_${timeStr}.xlsx`;
    
        XLSX.writeFile(workbook, filename);
    }

    // Add these with useState
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10; // adjust as needed

    // Calculate paginated data
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        fetchOrders(); 
    },[])

  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>Orders</h3>
                    <button className='btn btn-success' onClick={downloadExcel}>Download Excel</button>
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <SideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9 pb-5'>
                    <div className='card shadow'>
                    <div className="card-body p-4">
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Payment Status</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders && currentOrders.map((order) => {
                                        return(
                                            <tr>
                                                <td>
                                                    <Link to={`${order.id}`}>{order.id}</Link>
                                                </td>
                                                <td>{order.address.name}</td>
                                                <td>{order.address.email}</td>
                                                <td>&#8377;{order.grand_total}</td>
                                                <td>{order.created_at}</td>
                                                <td>
                                                    {
                                                        order.payment_status
                                                            ? order.payment_status === 'not paid'
                                                                ? <span className="badge bg-danger">Not Paid</span>
                                                                : <span className="badge bg-success">Paid</span>
                                                            : <span className="badge bg-secondary">Unknown</span>
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        order.status == 'pending' && <span className='badge bg-warning'> Pending</span> 
                                                    }
                                                    {
                                                        order.status == 'delivered' && <span className='badge bg-success'> Delivered</span> 
                                                    }
                                                    {
                                                        order.status == 'cancelled' && <span className='badge bg-warning'> Cancelled</span> 
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <nav className="mt-3">
                            <ul className="pagination justify-content-end">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                                </li>
                                {pageNumbers.map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button onClick={() => paginate(number)} className="page-link">
                                    {number}
                                    </button>
                                </li>
                                ))}
                                <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default ShowOrder