
  // not added till now
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const itemsNumber = useSelector((state) => state.cart.productsNumber);
    var isboolen = false;
    if (localStorage.getItem('tokens') && (itemsNumber > 0) ) {
            isboolen = true;
    }
    else {
        isboolen = false;
    }
    return (
      <>
        {isboolen ? (<Outlet />) : (
            <>
               {localStorage.getItem("tokens")?<Navigate to={'/cart'} />:<Navigate to={ '/login' } />}
            </>
        )}
      </>
    );
};

export default PrivateRoute;