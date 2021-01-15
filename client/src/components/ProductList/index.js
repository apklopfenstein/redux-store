import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { updateProducts} from '../../redux/actions';
import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif"
import { idbPromise } from '../../utils/helpers';

function ProductList({ products, currentCategory, updateProducts }) {
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if(data) {
      updateProducts(data.products);
      // dispatch({
      //   type: UPDATE_PRODUCTS,
      //   products: data.products
      // });

      // save each product to IndexedDB using the helper function also
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      // since we're offline, get all of the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        updateProducts(products);
        // dispatch({
        //   type: UPDATE_PRODUCTS,
        //   products: products
        // });
      });
    }
  }, [data, loading, updateProducts]);

  function filterProducts() {
    if(!currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key={product._id}
                  item={product}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default connect(
  state => ({
    currentCategory: state.currentCategory,
    products: state.products
  }),
  {
    updateProducts
  }
)(ProductList);
