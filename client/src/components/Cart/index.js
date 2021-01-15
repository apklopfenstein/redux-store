import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { loadStripe } from '@stripe/stripe-js';
import { connect } from 'react-redux';

import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import { idbPromise } from '../../utils/helpers';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { addMultipleToCart, toggleCart } from '../../redux/actions';
import './style.css';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = ({ cart, cartOpen, toggleCart, addMultipleToCart }) => {
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            addMultipleToCart(cart);
        };

        if (!cart.length) {
            getCart();
        }
    }, [cart.length, addMultipleToCart]);

    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session });
            });
        }
    }, [data]);

    if (!cartOpen) {
        return (
            <div className="cart-closed" onClick={toggleCart}>
                <span role="img" aria-label="trash">🛒</span>
            </div>
        )
    }

    function calculateTotal() {
        let sum = 0;
        cart.forEach(item => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    function submitCheckout() {
        const productIds = [];

        cart.forEach((item) => {
            for (let i = 0; i < item.purchaseQuantity; i++) {
                productIds.push(item._id);
            }
        });

        getCheckout({
            variables: { products: productIds }
        });
    }

    return (
        <div className="cart">
            <div className="close" onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {cart.length ? (
                <div>
                    {cart.map(item => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className="flex-row space-between">
                        <strong>Total: ${calculateTotal()}</strong>
                        {
                            Auth.loggedIn() ?
                            <button onClick={submitCheckout}>Checkout</button>
                            :
                            <span>(log in to checkout)</span>
                        }
                    </div>
                </div>
            ) : (
                <h3>
                    <span role="img" aria-label="shocked">😱</span>
                    You haven't added anything to your cart yet!
                </h3>
            )}
        </div>
    );
};

export default connect(
    state => ({
        cart: state.cart,
        cartOpen: state.cartOpen
    }),
    {
        addMultipleToCart,
        toggleCart
    }
) (Cart);