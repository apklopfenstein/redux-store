import React from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { pluralize } from "../../utils/helpers";
import { addToCart, updateCartQuantity } from '../../redux/actions';
import { idbPromise } from '../../utils/helpers';

function ProductItem({ cart, item, addToCart, updateCartQuantity }) {
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const handleAddToCart = () => {
    // find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);

    if (itemInCart) {
      updateCartQuantity(_id, parseInt(itemInCart.purchaseQuantity) + 1);
      // dispatch({
      //   type: UPDATE_CART_QUANTITY,
      //   _id: _id,
      //   purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      // });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      addToCart(item);
      // dispatch({
      //   type: ADD_TO_CART,
      //   product: { ...item, purchaseQuantity: 1 }
      // });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={handleAddToCart}>Add to cart</button>
    </div>
  );
}

export default connect(
  state => ({
    cart: state.cart
  }),
  {
    addToCart,
    updateCartQuantity
  }
)(ProductItem);
