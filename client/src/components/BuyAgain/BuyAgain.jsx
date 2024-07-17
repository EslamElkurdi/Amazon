import React, { useState } from 'react';
import './BuyAgain.css';
import {highlightText} from '../Orders/OrdersUtils';
import parse from 'html-react-parser';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateCartDb } from '../fireBaseUtils';
import { addQuantityToCart } from '../../redux/cartSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSelector   } from "react-redux";
import { i18n } from 'i18next';
import { useEffect } from "react";

function BuyAgain({productsAgain,searchTerm}) {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const dispatch = useDispatch();
  const handleAddToCart = (id) => {
    notify();
    // updateCart part
      updateCartDb(userId,id,1).then(()=>{
        // update nav cart quantity from firestore 
        dispatch(addQuantityToCart({  quantity: 1 }))
      })
    
  };
  const notify = () =>
    toast.success("added to Cart", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    const { t, i18n } = useTranslation();
    const language = useSelector((state) => state.language.language);
  
    useEffect( ()=>{
      i18n.changeLanguage(language);
  
    },[language])
  return (
    <>
    <div className="ordersBuyAgain">
    {productsAgain?.map(product => (
                  <div key={product.productId} className="buyAgainProduct">
                    <div className="buyAgainProductUpper">
                      <img src={product.images[0]} alt=""/>
                      <h3>{searchTerm?parse(highlightText(language=="ar"?product.ar.title:product.en.title,searchTerm)):(language=="ar"?product.ar.title:product.en.title)}</h3>
                      <h2>{searchTerm?parse(highlightText(product.price,searchTerm)):product.price}$</h2>
                      <h4>{searchTerm?parse(highlightText(language=="ar"?product.ar.description:product.en.description,searchTerm)):(language=="ar"?product.ar.description:product.en.description)}</h4>
                    </div>
                    <button onClick={()=>{handleAddToCart(product.productId)}}>{language=="ar"?"أضف للسلة":"Add to cart"}</button>
                    <ToastContainer />
                  </div>
            ))}
    </div>    
    </>
  )
}

export default BuyAgain
