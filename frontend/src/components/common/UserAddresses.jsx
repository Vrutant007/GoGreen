import React, { useEffect, useState } from 'react'
import { apiUrl, userId, usertoken } from './http'
import { Link } from 'react-router-dom';

const UserAddresses = ({onSelect}) => {
    const [address, SetAddress] = useState([]);
    const[selectId, SetSelectedId] = useState(null);
    useEffect(() => {
        const id = userId();

        fetch(`${apiUrl}/get-user-address/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${usertoken()}`
            }
        })
        .then(res => res.json())
        .then(result => {
            if(result.status == 200) {
                console.log(result);
                SetAddress(result.data);
            }
        })
    }, []);
    const handleSelect = (id) => {
        SetSelectedId(id);
        if (onSelect) onSelect(id);
    };

  return (
    <div className="address-wrapper pt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Choose Address</h4>
        </div>

        {address.length === 0 ? (
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p>No Addresses found.</p>
                <Link to="/account/address/add" className="btn btn-success">+ Add Address</Link>
            </div>
        ) : (
            <div className="address-list">
            {address.map(addr => (
                <div
                key={addr.id}
                className={`address-box ${selectId === addr.id ? 'selected' : ''}`}
                onClick={() => handleSelect(addr.id)}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-2">{addr.label}</h5>
                        <Link to={`/account/address/edit/${addr.id}`} className="text-primary">✏️ Edit</Link>
                    </div>
                    <p>{addr.name}, {addr.email}</p>
                    <p>{addr.mobile}</p>
                    <p>{addr.address}, {addr.city}, {addr.state} - {addr.zip_code}</p>
                </div>
            ))}
            </div>
        )}
    </div>
  )
}

export default UserAddresses