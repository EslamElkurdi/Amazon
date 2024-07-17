import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import {  HomePage, NavBar, Orders, ProductPage, SearchResults } from './components';

import Checkout from './components/Checkout/checkout'
import Cart from './components/Cart';

import Completion from './components/PaymentGateway/Completion';
import Payment from './components/PaymentGateway/Payment';
import Account from './users/account/Account';
import Security from './users/account/security/Security';
import NameSecurity from './users/account/security/nameSecurity/NameSecurity';
import EmailSecurity from './users/account/security/emailSecurity/EmailSecurity';
import PasswordSecurity from './users/account/security/passwordSecurity/PasswordSecurity';
import NotFound from './components/NotFound';
import Login from './users/login/Login';
import Category from './components/Catrgory/Category';
import PrivateRoute from './PR';
const MainLayout = () => {
    return (
      <div>
        <>
          <Routes>
            {!localStorage.getItem('tokens') && (
              <Route path='/payment' element={<Login />} />
            )}
          </Routes>
          <NavBar />
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/search' element={<SearchResults />} />
            <Route path='/product/:id' element={<ProductPageWithKey />} />
            {/*from 9*/}
            <Route path='/cart' element={<Cart />} />
            <Route path='/completion' element={<Completion />} />
            

            <Route path='/category/:id' element={<CategoryPageWithKey />} />
            {/*from 9*/}

            <Route element={<PrivateRoute />}>
              <Route path='/orders' element={<Orders />} />
              <Route path='/account' element={<Account />} />
              <Route path='/security' element={<Security />} />
              <Route path='/nameSecurity' element={<NameSecurity />} />
              <Route path='/emailSecurity' element={<EmailSecurity />} />
              <Route path='/passwordSecurity' element={<PasswordSecurity />} />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
        </>
      </div>
    );
};
// from 9
// ProductPageWithKey is a wrapper component that generates a unique key based on the location
const ProductPageWithKey = () => {
  const location = useLocation();
  const key = location.pathname; // Generate a unique key based on the pathname
  return <ProductPage key={key} />;
};
const CategoryPageWithKey = () => {
  const location = useLocation();
  const key = location.pathname; // Generate a unique key based on the pathname
  return <Category key={key} />;
};
// from 9
export default MainLayout;