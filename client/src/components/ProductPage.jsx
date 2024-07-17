import { ToastContainer, toast } from "react-toastify";
import {useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ProductDetails } from "./";
import { GB_CURRENCY } from "../utils/constants";
import { callAPI } from "../utils/CallApi";
import { addToCart,addQuantityToCart } from "../redux/cartSlice";// from 8
import { useTranslation } from "react-i18next";
import {  useSelector } from 'react-redux';
import StarRating from "./../components/StarRating/StarRating";
import { getProduct, getReviewsForProduct, submitReviewsForProduct ,createNumberArray, updateCartDb,getAvailableQuantityDb,getAvailableQuantityLocalStorage, updateCartLocalStorage, getTopSellerOfSpecificProductCategory, getCartTotalQuantityLocalStorage, getCartTotalQuantityDb} from "./fireBaseUtils";
import Loader from "./Loader/Loader";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewsList, setReviewsList] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState(0); // ahmedHossam
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userLoggedIn, setUserLoggedIn] = useState(localStorage.getItem('tokens'));
  const [topSellerProductsCategory, setTopSellerProductsCategory] = useState([]);// from 8
  const navigate = useNavigate();
  
  // const getProduct = () => {
  //   callAPI(`data/products.json`).then((productResults) => {
  //     setProduct(productResults[id]);
  //   });
  // };

  const handleAddToCart = () => {
    notify();
    //const productWithQuantity = { ...product, quantity: quantity };
    //dispatch(addToCart(productWithQuantity));
    // ahmed hossam code 
    // 

    // updateCart part
    if( userLoggedIn ){
      updateCartDb(userId,id,quantity).then(()=>{
              // update nav cart quantity from firestore // from 8
        dispatch(addQuantityToCart({  quantity: quantity }))
      })
      setAvailableQuantity(availableQuantity-quantity)
      setQuantity(1);

    }else{
      updateCartLocalStorage("1",id,quantity).then(()=>{
      // update nav cart quantity from localstoreagee // from 8
      dispatch(addToCart({  quantity: getCartTotalQuantityLocalStorage() }))
      })
      setAvailableQuantity(availableQuantity-quantity)
      setQuantity(1);

    }
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

  useEffect(() => {
    getProduct(id).then(prod=>{
      setProduct(prod)
     })
     getReviewsForProduct(id).then(reviews=>{
      setReviewsList(reviews)
     })
     if( userLoggedIn ){
       async function AvailableQuantity(){
         setAvailableQuantity(await getAvailableQuantityDb(userId,id))// ahmedHOssam you must replace nubmer 3  with real quantity that comes from db
        }
       AvailableQuantity()
                   // update cart quantity from firestore // from 8
                  //  getCartTotalQuantityDb(userId).then(
                  //   (res)=>{dispatch(addToCart({  quantity: res }))}
                  //   )
     }else{
       async function AvailableQuantity(){
         setAvailableQuantity(await getAvailableQuantityLocalStorage("1",id))// ahmedHOssam you must replace nubmer 3  with real quantity that comes from db

        }
       AvailableQuantity()
        // update cart quantity from localstoreagee // from 8
        // dispatch(addToCart({  quantity: getCartTotalQuantityLocalStorage() }))
     }
    }, []);
// from 8
  useEffect(() => {
    if(product){
      getTopSellerOfSpecificProductCategory(product.category._id).then(products=>{
        setTopSellerProductsCategory(products)
        })
    }
    }, [product]);
         // from 8
    // 
    const language = useSelector((state) => state.language.language);
    const { t, i18n } = useTranslation();
    useEffect(() => {
      i18n.changeLanguage(language);
  
      console.log(language);
  
    }, [language])

    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const submitReview = () => {
      // Check if the review meets the criteria
      if (review.trim() === "" || review.trim().length <= 4) {
        // If the review is empty or too short, set the error message
        setErrorMessage("Please enter a review with at least 5 characters.");
        return; // Exit the function without submitting the review
      }
    
      // Clear any existing error message
      setErrorMessage("");
    
      // Proceed with submitting the review if it meets the criteria
      const newReview = { rating, review };
    
      submitReviewsForProduct(id, userId, newReview)
        .then(() => {
          // Review submitted successfully
          setRating(0);
          setReview("");
          // Fetch reviews for the product again
          getReviewsForProduct(id)
            .then(reviews => {
              setReviewsList(reviews);
            })
            .catch(error => {
              console.error("Error fetching reviews:", error);
            });
        })
        .catch(error => {
          console.error("Error submitting review:", error);
        });
    };    useEffect(() => {
      getProduct();
    }, []);


  return (
    
      <div className='bg-amazonclone-background min-h-[700px]'>
        {!product ?<Loader/>:(
        <div className=' m-auto p-4'>
          <div className=' flex justify-between gap-8 md:flex-row flex-col mb-20'>
            {/* Left */}
            <div className='md:w-1/4 p-8 rounded bg-white m-auto'>
              <img src={product.images[0]} alt='Main product' />
            </div>
            {/* Middle */}
            <div className=' md:w-2/4 p-4 rounded bg-white  divide-y divide-gray-400'>
              <div className='mb-3'>
                <ProductDetails product={product} ratings={true} />
              </div>
              <div className='text-base xl:text-lg mt-3'>
                {language=="ar"?product.ar.description:product.en.description}
              </div>
            </div>
            {/* Right */}
            <div className=' md:w-1/4 p-4 rounded bg-white'>
              <div className='text-xl xl:text-2xl text-red-700 text-right font-semibold'>
                {GB_CURRENCY.format(product.price)}
              </div>
              <div className='text-base xl:text-lg text-gray-500 text-right font-semibold'>
                RRP:{' '}
                <span className='line-through'>
                  {GB_CURRENCY.format(product.price+25)}
                </span>
              </div>
              <div className='text-sm xl:text-base text-blue-500 font-semibold mt-3'>
                {t("FREE Returns")}              </div>
              <div className='text-sm xl:text-base text-blue-500 font-semibold mt-1'>
              {t("FREE Delivery")} 
              </div>
              {(availableQuantity>0)?<div className="text-base xl:text-lg text-green-700 font-semibold mt-1">
              {t("In Stock")} 
              </div>:<div className="text-base xl:text-lg text-red-700 font-semibold mt-1">
              {t("Out of Stock")} 
              </div>}
              <div className="text-base xl:text-lg mt-1">
              {t("Quantity:")} 
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="p-2 bg-white border rounded-md focus:border-indigo-600"
                >
                  {createNumberArray(availableQuantity).map((item)=>{return <option key={item} value={item}>{item}</option>})}
                  
                </select>
              </div>
              {availableQuantity&&<button onClick={handleAddToCart} className="btn mt-3">
              {language=="ar"?"اضف الى العربة":"Add to Cart"}
              </button>}
              <ToastContainer />
            </div>
          </div>

          {/* from 8 */}
          <div className="cards grid grid-cols-4 gap-4 mt-8">
          {topSellerProductsCategory.map((product) => (
            <div key={product.productId} className="bg-white shadow-md p-4 rounded-lg cursor-pointer" onClick={()=>{navigate("/product/"+product.productId)}}>
              <div className="flex justify-center">
                <img
                  src={`${product.images[0]}`}
                  style={{ height: "300px", width: "300px" }} 
                  alt=""
                />
              </div>
              <div className="flex justify-center">
                <ProductDetails product={product} ratings={true} />
              </div>
              <div className="flex justify-center">
                {GB_CURRENCY.format(product.price)}
              </div>
            </div>  ))}
          </div>
          {/* from 8 */}

          <div className="mt-8" style={{ width: "100%", fontSize: "1.2em" }}>
            <h2 style={{ fontSize: "1.5em" }}>{!userLoggedIn&&(language=="ar"?"  سجل الدخول":"Login to ")}{language=="ar"?"  اضافة تقييم":"Add a Review"}</h2>
            {userLoggedIn&&<div style={{ marginBottom: "10px" }}>
              {/* Star Rating Input */}
              <div style={{ marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>{language=="ar"?"التقييم:":"Rating:"} </span>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={language=="ar"?" اكتب تقييمك هنا":"Write your review here..."}
                style={{ width: "100%", fontSize: "1.2em", padding: "5px" }}
              ></textarea>
              {errorMessage && (
                <div
                  className="error-message"
                  style={{ color: "red", fontSize: "1.2em", marginTop: "10px" }}
                >
                  {errorMessage}
                </div>
              )}
              <button id="submitReviewButton"
                onClick={submitReview}
                style={{
                  fontSize: "1.2em",
                  marginTop: "10px",
                  backgroundColor: "green",
                  color: "white",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {language=="ar"?" انشر تقييمك ":"Submit Review"}
              </button>
            </div>}
            <div className="mt-4">
              <h2 style={{ fontSize: "1.5em" }}>{language=="ar"?"التقييمات ":"Reviews"}</h2>
              {reviewsList.map((item, index) => (
                <div key={index} className="mt-2" style={{ fontSize: "1.2em" }}>
                  <div style={{ marginBottom: "5px" }}>
                    <span style={{ marginRight: "10px" }}>{language=="ar"?"التقييم:":"Rating:"} </span>
                    <StarRating rating={item.rating} />
                  </div>
                  <div style={{ fontSize: "1.2em" }}>{language=="ar"?"التعليق:":"Review:"} {item.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    
  );
};


export default ProductPage;
