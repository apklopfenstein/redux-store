import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';

import { updateProducts, updateCartQuantity, addToCart, removeFromCart } from '../redux/actions';
import { QUERY_PRODUCTS } from "../utils/queries";
import { idbPromise } from "../utils/helpers";
import Cart from '../components/Cart';
import spinner from '../assets/spinner.gif'

function Detail({ cart, products, updateProducts, updateCartQuantity, addToCart, removeFromCart }) {
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if(products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      updateProducts(data.products);

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        updateProducts(indexedProducts);
      });
    }
  }, [products, data, loading, updateProducts, id]);

  const handleAddToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      updateCartQuantity(id, parseInt(itemInCart.purchaseQuantity) + 1);

      // if we're updating quantity, use existing item data and increment purchaseQuantity value by one
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      addToCart(currentProduct);
      // if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(currentProduct._id);

    // upon removal from cart, delete the item from IndexedDB using the `currentProduct._id` to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">
            ← Back to Products
          </Link>

          <h2>{currentProduct.name}</h2>

          <p>
            {currentProduct.description}
          </p>

          <p>
            <strong>Price:</strong>
            ${currentProduct.price}
            {" "}
            <button onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button disabled={!cart.find(p => p._id === currentProduct._id)} onClick={handleRemoveFromCart}>
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {
        loading ? <img src={spinner} alt="loading" /> : null
      }
      <Cart />
    </>
  );
};

export default connect(
  state => ({
    cart: state.cart,
    products: state.products
  }),
  {
    updateProducts,
    updateCartQuantity,
    addToCart,
    removeFromCart
  }
)(Detail);
