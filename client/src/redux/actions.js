import { UPDATE_PRODUCTS, UPDATE_CART_QUANTITY, ADD_TO_CART, ADD_MULTIPLE_TO_CART, TOGGLE_CART, REMOVE_FROM_CART, UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from './actionTypes';

export const updateProducts = (products) => ({
  type: UPDATE_PRODUCTS,
  products
});

export const updateCartQuantity = (_id, purchaseQuantity) => ({
  type: UPDATE_CART_QUANTITY,
  _id,
  purchaseQuantity
});

export const addToCart = (item) => ({
  type: ADD_TO_CART,
  product: { ...item, purchaseQuantity: 1 }
});

export const removeFromCart = (_id) => ({
  type: REMOVE_FROM_CART,
  _id
});

export const addMultipleToCart = (cart) => ({
  type: ADD_MULTIPLE_TO_CART,
  products: [...cart]
});

export const toggleCart = () => ({
  type: TOGGLE_CART
});

export const updateCategories = (categories) => ({
  type: UPDATE_CATEGORIES,
  categories
});

export const updateCurrentCategory = (currentCategory) => ({
  type: UPDATE_CURRENT_CATEGORY,
  currentCategory
});