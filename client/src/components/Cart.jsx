import { useSelector, useDispatch   } from "react-redux";
import { Link } from "react-router-dom";
import { ProductDetails } from ".";
import { useEffect, useState } from "react";
import { GB_CURRENCY } from "../utils/constants";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import {
  removeFromCart,
  decrementInCart,
  incrementInCart,
} from "../redux/cartSlice";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./PaymentGateway/CheckoutForm";
import { useTranslation } from "react-i18next";
import { getCartProductsDb, removeItem,increaseItem,deleteItem, getCartProductsLocalStorage, getCartProductsForPayment } from "./fireBaseUtils";
import { addToCart,addQuantityToCart } from "../redux/cartSlice";// from 8
import { getCartTotalQuantityLocalStorage,getCartTotalQuantityDb2 } from "./fireBaseUtils";// from 8
import Loader from "./Loader/Loader";
const Cart = () => {

const [stripePromise, setStripePromise] = useState(null);
const [clientSecret, setClientSecret] = useState("");
const [cartProductsObj, setCartProductsObj] = useState({cartProducts:[]});
const [userLoggedIn, setUserLoggedIn] = useState(localStorage.getItem('tokens'));
const [userId, setUserId] = useState(localStorage.getItem('userId'));
useEffect(() => {
  fetch("/config").then(async (r) => {
    const { publishableKey } = await r.json();
    setStripePromise(loadStripe(publishableKey));
  });
    // ahmed hossa m code 
    async function gettCartProducts(userId){
      // test
      console.log(await getCartProductsForPayment(userId),"follow order")
      //
      if(userLoggedIn){
        console.log('logged in')
        setCartProductsObj(await getCartProductsDb(userId));
        setCartProductsObj(await getCartProductsDb(userId));
        setCartProductsObj(await getCartProductsDb(userId));
      }else{
        console.log('no logged in')
        setCartProductsObj(await getCartProductsLocalStorage("1"));
        setCartProductsObj(await getCartProductsLocalStorage("1"));
      }
    }
    gettCartProducts(userId)
  
}, []);

useEffect(() => {
  fetch("/create-payment-intent", {
    method: "POST",
    body: JSON.stringify({}),
  }).then(async (result) => {
    var { clientSecret } = await result.json();
    setClientSecret(clientSecret);
  });
}, []);




  const products = useSelector((state) => state.cart.products);
  const itemsNumber = useSelector((state) => state.cart.productsNumber);
  const subtotal = useSelector((state) =>
    state.cart.products.reduce(
      (subtotal, product) => subtotal + product.price * product.quantity,
      0
    )
  );
  const dispatch = useDispatch();


  const language = useSelector((state) => state.language.language);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);

    console.log(language);

  }, [language])

  useEffect(()=>{// from 8
    if( userLoggedIn && Object.keys(cartProductsObj).length > 0){
                     
      
       dispatch(addToCart({  quantity: getCartTotalQuantityDb2(cartProductsObj) }))
       
}else{

dispatch(addToCart({  quantity: getCartTotalQuantityLocalStorage() }))
}
  },[cartProductsObj])


  return (
    <div className='bg-amazonclone-background min-h-[700px]'>
    {cartProductsObj.cartProducts.length == 0 ?<Loader/>:( // from 9
      <div className=' m-auto pt-8'>
        <div className='flex justify-between gap-8 sm:flex-row flex-col'>
          {/* Products */}
          <div className=' sm:w-2/3 bg-white'>
            <div className='text-2xl xl:text-3xl m-4'>{t('Shopping Cart')}</div>
            {cartProductsObj.cartProducts.map((product) => {
              return (
                <div key={product.productId}>
                  <div className='grid grid-cols-12 divide-y divide-gray-400 mr-4'>
                    <div className='col-span-10 grid grid-cols-8 divide-y divide-gray-400'>
                      <div className='col-span-2'>
                        <Link to={`/product/${product.productId}`}>
                          <img
                            className='p-4 m-auto'
                            src={product.images[0]}
                            alt='Checkout product'
                            style={{height:"200px"}}
                          />
                        </Link>
                      </div>
                      <div className='col-span-6'>
                        <div className='font-medium text-black mt-2'>
                          <Link to={`/product/${product.productId}`}>
                            <ProductDetails product={product} ratings={false} />
                          </Link>
                        </div>
                        <div>
                          <button
                            className='text-sm xl:text-base font-semibold rounded text-blue-500 mt-2 mb-1 cursor-pointer'
                            // onClick={() => dispatch(removeFromCart(product.id))}
                            onClick={() => {setCartProductsObj(deleteItem(product.productId,cartProductsObj,userId,userLoggedIn))}}
                          >
                            {t('Delete')}
                          </button>
                        </div>
                        <div className='grid grid-cols-3 w-20 text-center'>
                        {product.quantity>1&&<div
                            className="text-xl xl:text-2xl bg-gray-400 rounded cursor-pointer"
                            // onClick={() =>
                            //   dispatch(decrementInCart(product.productId))
                            // }
                            onClick={() => {setCartProductsObj(removeItem(product.productId,cartProductsObj,userId,userLoggedIn));}}
                          >
                            -
                          </div>}
                          <div className='text-lg xl:text-xl bg-gray-200'>
                            {product.quantity}
                          </div>
                          {product.quantity<product.quantityInStock&&<div
                            className="text-xl xl:text-2xl bg-gray-400 rounded cursor-pointer"
                            onClick={() =>
                              // dispatch(incrementInCart(product.productId))
                              setCartProductsObj(increaseItem(product.productId,cartProductsObj,userId,userLoggedIn))
                            }
                          >
                            +
                          </div>}
                        </div>
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <div className='text-lg xl:text-xl mt-2 mr-4 font-semibold'>
                        {GB_CURRENCY.format(product.price)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className='text-lg xl:text-xl text-right mb-4 mr-4'>
            {t('Subtotal')} ({cartProductsObj.cartProductsQuantity} {t('items')}):{' '}
              <span className='font-semibold'>
                {GB_CURRENCY.format(cartProductsObj.cartTotal)}
              </span>
            </div>
          </div>
          {/* Checkout */}
          <div className=' sm:w-1/3 bg-white rounded p-7 flex flex-col h-64'>
            <div className='text-xs xl:text-sm text-green-800 mb-2'>
            {t('Your order qualifies for')}{' '}
              <span className='font-bold'>{t('FREE DELIVERY')}</span>. {t('Delivery Details')}
            </div>
            <div className='text-base xl:text-lg mb-4'>
            {t('Subtotal')} ({cartProductsObj.cartProductsQuantity} {t('items')}):{' '}
              <span className='font-semibold'>
                {GB_CURRENCY.format(cartProductsObj.cartTotal)}
              </span>
            </div>
            {localStorage.getItem('tokens') ? (
              <Link to={'/finalcheckout'}>
                <button className='btn'>{t('Proceed to Checkout')}</button>
              </Link>
            ) : (
                <>
                  <Link to={"/login"}>
                  <button className='btn' onClick={()=>{localStorage.setItem("goToCheckoutAfterLogin",true)}}>{t('Proceed to Checkout')}</button>
                  </Link>
                </>
            )}
            {/* test */}
            {/* {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )} */}
          </div>
        </div>
      </div>
    )} {/* from 9 */}
    </div>
  );
};

export default Cart;