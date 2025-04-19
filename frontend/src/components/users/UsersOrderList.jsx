import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import UserSideBar from './UserSideBar'
import { apiUrl, usertoken } from '../common/http'

const UsersOrderList = () => {

    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);

    const fetchUsersOrders = async() => {
        const response = await fetch(`${apiUrl}/get-orders`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${usertoken()}`
            },
        }).then(res => res.json())
        .then(result => {
            if(result.status == 200){
                setOrders(result.data);
                setItems(result.data.items);
                console.log(result.data)
            }else{
                console.log('Somthing Went Wrong')
            }
        })
    }

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; // change if needed

    // Pagination calculations
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Page numbers for pagination
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
        pageNumbers.push(i);
    }

    // Page change handler
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(()=>{
        fetchUsersOrders();
    },[])

  return (
    <>
        <Header/>
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h3 className='h3 pb-0 mb-0'>My Orders</h3>
                    {/* <Link to='/admin/categories/create' className='btn btn-primary'>Create</Link> */}
                </div>
                {/*SideBar */}
                <div className='col-md-3'>
                    <UserSideBar/>
                </div>
                {/*MainBar */}
                <div className='col-md-9'>
                    <div className='card shadow mb-5'>
                    <div className="card-body p-4">
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Grand Total</th>
                                    <th>Payment Status</th>
                                    <th>Product Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.length > 0 && currentOrders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        {/* First row for Order ID and Grand Total */}
                                        <tr>
                                            <td rowSpan={order.items ? order.items.length : 1}>{order.id}</td>
                                            {order.items && order.items.length > 0 ? (
                                                <>
                                                    <td>{order.items[0].name}</td>
                                                    <td>{order.items[0].qty}</td>
                                                </>
                                            ) : (
                                                <td colSpan="2">No items</td>
                                            )}
                                            <td rowSpan={order.items ? order.items.length : 1}>{order.grand_total}</td>
                                            <td rowSpan={order.items ? order.items.length : 1}>
                                                {order.payment_status === 'not paid'
                                                    ? <span className="badge bg-danger">Not Paid</span>
                                                    : <span className="badge bg-success">Paid</span>}
                                            </td>
                                            <td rowSpan={order.items ? order.items.length : 1}>
                                                {order.status === 'pending' && <span className='badge bg-warning'> Pending</span>}
                                                {order.status === 'delivered' && <span className='badge bg-success'> Delivered</span>}
                                                {order.status === 'cancelled' && <span className='badge bg-danger'> Cancelled</span>}
                                            </td>
                                        </tr>

                                        {/* Additional rows for remaining items */}
                                        {order.items && order.items.length > 1 && order.items.slice(1).map((item, index) => (
                                            <tr key={`${order.id}-${index}`}>
                                                <td>{item.name}</td>
                                                <td>{item.qty}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
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

export default UsersOrderList