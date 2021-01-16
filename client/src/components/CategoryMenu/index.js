import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { QUERY_CATEGORIES } from "../../utils/queries";
import { updateCategories, updateCurrentCategory } from '../../redux/actions';
import { idbPromise } from "../../utils/helpers";

function CategoryMenu() {
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories);

  useEffect(() => {
    // if categoryData exists for has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      dispatch(updateCategories(categoryData.categories));

      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch(updateCategories(categories));
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch(updateCurrentCategory(id));
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
