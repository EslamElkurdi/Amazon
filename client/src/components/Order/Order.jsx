import React, { useEffect, useState } from 'react'
import {readableTimestamp} from './OrderUtils'
import {highlightText} from '../Orders/OrdersUtils'
import Stepper from '../Stepper/Stepper';
import './Order.css'
import parse from 'html-react-parser';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector   } from "react-redux";
import { i18n } from 'i18next';
function Order({ order, searchTerm }) {
  const language = useSelector((state) => state.language.language);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);

    console.log(language);

  }, [language])
  const navigate = useNavigate();
  const [name, setName] = useState();
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName);
    }
    else {
      setName("")
    }
  },[])
  
  return (
     <>
      <div className="ordersContents">
        <div className="ordersDisplay">
          <div className="theOrder">
            <div className="orderFirstSection">
              <div className="orderPlaced">
                <h5>{language=="ar"?"تاريخ الطلب":"ORDER PLACED"}</h5>
                <h3>{readableTimestamp(order)}</h3>
              </div>
              <div className="orderTotal">
                <h5>{language=="ar"?"المجموع":"TOTAL"}</h5>
                <h3>{searchTerm?parse(highlightText(order.data.amount,searchTerm)):order.data.amount}$</h3>
              </div>
              <div className="orderShipTo">
                <h5>{language=="ar"?"شحن الى":"SHIP TO"}</h5>
                <h3>
                    {searchTerm?parse(highlightText(order.data.building,searchTerm)):order.data.building},
                    {searchTerm?parse(highlightText(order.data.streetAddress,searchTerm)):order.data.streetAddress},
                    {searchTerm?parse(highlightText(order.data.city,searchTerm)):order.data.city},
                    {searchTerm?parse(highlightText(order.data.name,searchTerm)):order.data.name}
                </h3>
              </div>
            </div>
            <div className="orderSecondSection">
              <h2 className='orderStateH2'>{language=="ar"?"حالة الطلب":"Order state"}</h2>
              <Stepper orderState={order.data.state}/>
              <div className="orderProducts">
            {order.data.basket?.map(product => (
            <div key={product.productId} className="orderProduct">
              <div className="orderProductImgAndInfos">
                <img src={product.images[0]} alt="" className="orderProductImg"/>
                <div className="orderProductInfos">
                  <h3>{searchTerm?parse(highlightText((language=="ar"?product.ar.title:product.en.title),searchTerm)):(language=="ar"?product.ar.title:product.en.title)  }</h3>
                  <h4>{searchTerm?parse(highlightText((language=="ar"?product.ar.description:product.en.description),searchTerm)):(language=="ar"?product.ar.description:product.en.description) }</h4>
                  <div className="orderProductInfosButtons">
                    <button className="orderBuyAgain">{language=="ar"?"شراء مرة أخرى":"Buy it again"}</button>
                    <button className="orderViewItem" onClick={()=>{navigate("/product/"+product.productId)}}>{language=="ar"?"اعرض المنتج":"View your item"}</button>
                  </div>
                </div>
              </div>
              <button className="orderProductReview" onClick={()=>{navigate("/product/"+product.productId+"#submitReviewButton")}}>{language=="ar"?"اكتب مراجعه للمنتج":"Write a product review"}</button>
            </div>
            ))}
              </div>
            </div>
            <div className="orderThirdSection">
              <h3>Archive order</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Order
