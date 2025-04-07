import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../components/context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, food_list, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [validCart, setValidCart] = useState([]);

  // ✅ Step 1: Compute valid cart items
  useEffect(() => {
    const filteredCart = Object.entries(cartItems)
      .map(([itemId, quantity]) => {
        const item = food_list.find(product => Number(product.id) === Number(itemId));
        return item ? { ...item, quantity } : null;
      })
      .filter(Boolean); // Remove null values

    setValidCart(filteredCart);
  }, [cartItems, food_list]); // Update when cartItems or food_list changes

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {validCart.length > 0 ? (
          validCart.map((item) => (
            <div key={item.id}> 
              <div className="cart-items-title cart-items-item">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{item.quantity}</p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
                <p onClick={() => removeFromCart(item.id)} className='cross'>x</p>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? "0.00" : "2.00"}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? "0.00" : (getTotalCartAmount() + 2).toFixed(2)}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
