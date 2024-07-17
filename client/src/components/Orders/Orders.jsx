import React, { useEffect,useState } from 'react'
import {getUserOrders,sendOrderDataToUserEmail,getUserProductsAgain,searchOrders,searchProductsAgain,extractOrdersYears,filterOrdersBySelectedYear} from './OrdersUtils'
import Order from '../Order/Order';
import BuyAgain from '../BuyAgain/BuyAgain';
import './Orders.css';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deleteUserCart, pushOrder } from '../fireBaseUtils';

function Orders() {

  // state section
  let userId=localStorage.getItem('userId')
  const [userLoggedIn, setUserLoggedIn] = useState(localStorage.getItem('tokens'));
  const [orders,setOrders]=useState([]);
  const [allOrders,setAllOrders]=useState([]);
  const [productsAgain,setProductsAgain]=useState([]);
  const [allProductsAgain,setAllProductsAgain]=useState([]);
  const [tabPressed,setTabPressed]=useState("orders");
  const [searchTerm,setSearchTerm]=useState("");
  const [ordersYears,setOrdersYears]=useState([]);
  const [selectedYear,setSelectedYear]=useState("2024");

  // life cycle methods section
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (userLoggedIn) {
        const userOrders = await getUserOrders(userId);
        setAllOrders(userOrders);
        const yearOrders=filterOrdersBySelectedYear(selectedYear,userOrders);
        setOrders(yearOrders);
        const productsAgain = getUserProductsAgain(userOrders);
        setProductsAgain(productsAgain);
        setAllProductsAgain(productsAgain);
        const years = extractOrdersYears(userOrders);
        setOrdersYears(years);
        
      } else {
        setOrders([]);
        setAllOrders([]);
        setProductsAgain([]);
        setOrdersYears([]);
      }
    };

    fetchUserOrders();
    
  },[])//[user] put user when user comes from context or redux

  useEffect(() => {
    const yearOrders=filterOrdersBySelectedYear(selectedYear,allOrders)
    setOrders(yearOrders);
  },[selectedYear])

  // functions handling ui events section
  function switchTabs(tabPressed){
      setSearchTerm("");// empty search input
      setTabPressed(tabPressed);
      if(tabPressed=="orders"){
        setProductsAgain(allProductsAgain);
        setSelectedYear(ordersYears[0]);
        const yearOrders=filterOrdersBySelectedYear(selectedYear,allOrders)
        setOrders(yearOrders);
      }
  };
  const handleSearchInputChange =async (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if(tabPressed=="orders"){
      const SearchRes= await searchOrders(searchTerm,userId);
      setOrders(SearchRes)
    }else if(tabPressed=="buy again"){
      const SearchRes=searchProductsAgain(allOrders,searchTerm)
      setProductsAgain(SearchRes)
    }
    if(searchTerm==""){
      const yearOrders=filterOrdersBySelectedYear(selectedYear,allOrders)
      setOrders(yearOrders);
    }
  };

  const language = useSelector((state) => state.language.language);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);

    console.log(language);

  }, [language])
  
  return (
    <>
      <div className={`ordersContainer ${language=="ar"&&"ordersContainerRTL"}`}>
        <div className="titleAndSearchContainer">
          <h1>{t('Your Orders')}</h1>
          <div className="ordersSearchContainer">
            <div className="ordersSearchInput">
              <i className="ordersSearchIcon"></i>
              <input type="text" placeholder={t('Search all orders')} value={searchTerm} onChange={handleSearchInputChange}/>
            </div>
            <button className="ordersSearchButton">{t('Search Orders')}</button>
          </div>
          <div className='ordersProceedToCheckOut'>
            {/* put proceed to checkout here... */}
          </div>
        </div>
        <div className="ordersTabsNav">
          <button className={`ordersTabsNavButton ${tabPressed=="orders"&&"ordersTabsNavButtonActive"}`} onClick={()=>{switchTabs("orders")}}>{t('Orders')}</button>
          <button className={`ordersTabsNavButton ${tabPressed=="buy again"&&"ordersTabsNavButtonActive"}`} onClick={()=>{switchTabs("buy again")}}>{t('Buy again')}</button>
        </div>
        {tabPressed=="orders"&&<><div className={`ordersNumberPerYear ${searchTerm&&"orders-display-none"}`}>
          {orders.length} {t('orders placed in')}   
          <select id="yearSelect" onChange={(event)=>{setSelectedYear(event.target.value)}}>
          {ordersYears.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
          </select>
        </div>
        {orders?.map(order => (
              <div key={`order-${order.id}`}>
                <Order order={order} searchTerm={searchTerm} />
              </div>
            ))}
        </>}
        {tabPressed=="buy again"&&<BuyAgain productsAgain={productsAgain} searchTerm={searchTerm}/>}
      </div>
    </>
  )
}

export default Orders
