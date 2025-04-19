import { createContext, useState } from "react";
import { apiUrl } from "../common/http";
import { toast } from "react-toastify";

export const CartContext = createContext();
export const CartProvider = ({children}) => {
    const [cartData , setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || [] );
    const [coupon, setCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    const addToCart = (product) => { 
        let updatedCart = [...cartData ];

        // If Cart is empty
        const existingProduct = updatedCart.find(item => item.product_id === product.id);

        if (existingProduct) {
            existingProduct.qty += 1; // Increase quantity if product exists
        } else {
            updatedCart.push({
                id: `${product.id}-${Math.random() * 100000}`,
                product_id: product.id,
                title: product.title,
                price: product.price,
                qty: 1,
                weight: product.weight,
                
                image_url: product.image_url,
            });
        }

        

        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    const Delivery = () => {
        return 0;
    }

    const subTotal = () => {
        let subtotal = 0;
        cartData.map(item => {
            subtotal += item.qty * item.price;
        })
        return subtotal;
    }

    const grandTotal = () => {
        let discounts = (discount / 100 ) * subTotal();
        return subTotal() + Delivery() - discounts;
    }

    const updateCartItem = (itemId, newQty) => {
        let updateCart = [...cartData];
        updateCart = updateCart.map(item => 
            (item.id == itemId) ? {...item, qty: newQty} : item
        )
        setCartData(updateCart)
        localStorage.setItem('cart', JSON.stringify(updateCart));
    } 

    const deleteCartItem = (itemId) => {
        const newCartData = cartData.filter(item => item.id != itemId)
        setCartData(newCartData)
        localStorage.setItem('cart', JSON.stringify(newCartData));
    }

    const getQty = () => {
        let qty = 0;
        cartData.map(item => {
            qty += parseInt(item.qty)
        });
        return qty;
    }

    const applyCoupon = (code) => {
        const upperCode = code.toUpperCase();
       // const discountAmount = validCoupons[upperCode];

        fetch(`${apiUrl}/coupon-code?code=${code}`)
        .then(res => res.json())
        .then(result =>{
            if(result.status == 200){
                const discountAmount = result.data.discount_amount || 0;

                setCoupon({ code: upperCode, discountAmount });
                setDiscount(discountAmount);
                toast.success(`Coupon ${upperCode} applied!`);
            }else{
                setCoupon(null);
                setDiscount(0);
                toast.error(result.message);
            }
        })
    }

    const removeCoupon = () => {
        setCoupon(null);
        setDiscount(0);
    }

    return (
        <CartContext.Provider value={{addToCart, cartData, Delivery, grandTotal, subTotal, updateCartItem, deleteCartItem, getQty, applyCoupon, removeCoupon, coupon, discount}}>
            {children}
        </CartContext.Provider>
    )
}