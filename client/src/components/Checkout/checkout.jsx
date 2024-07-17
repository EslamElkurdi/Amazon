import React, { useState } from 'react';
import Logo from '../componentsAccount/Logo';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoAlertCircleSharp } from 'react-icons/io5';
import Payment from '../PaymentGateway/Payment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { addShippingDataToCart, getCartProductsDb } from '../fireBaseUtils';

const Checkout = () => {

    // Transalate
    const language = useSelector((state) => state.language.language);
    const { t, i18n } = useTranslation();
    useEffect(() => {
      i18n.changeLanguage(language);
   
      console.log(language);
  
    }, [language]);

    useEffect(() => {
      getCartProductsDb(userId).then(
        (userCart)=>{
          setCart(userCart)
          console.log(userCart)
        }
      ).catch((err)=>{
        console.log("error getting user cart from db"+err)
      })
  
    }, []);

// get itemsNumber & subtotal from redux
  // const itemsNumber = useSelector((state) => state.cart.productsNumber);
  // const subtotal = useSelector((state) =>
  //   state.cart.products.reduce(
  //     (subtotal, product) => subtotal + product.price * product.quantity,
  //     0
  //   )
  // );
// get cart from fireBase
  const [cart, setCart] = useState({});
  // Errors
  const [errorName, setErrorName] = useState('');
  const [errorMobile, setErrorMobile] = useState('');
  const [errorStreetAddress, setErrorStreetAddress] = useState('');
  const [errorbuilding, setErrorBuilding] = useState('');
  const [errorCity, setErrorCity] = useState('');
  const [errorDistrict, setErrorDistrict] = useState('');
  const [errorGovernorate, setErrorGovernorate] = useState('');

  // Values
  const [userId, setUserId] = useState(localStorage.getItem('userId'));// form 8
  const [nameValue, setNameValue] = useState('');
  const [mobileValue, setMobileValue] = useState('');
  const [streetAddressValue, setStreetAddressValue] = useState('');
  const [buildingValue, setBuildingValue] = useState('');
  const [cityValue, setCityValue] = useState('');
  const [districtValue, setDistrictValue] = useState('');
  const [GovernorateValue, setGovernorateValue] = useState(''); 
  
  const [checkValidGovernorate, setCheckValidGovernorate] = useState('');
  
// to add payment in page
  const [payment, setPayment] = useState('');

  const GovernoratesInEgypt = ["alexandria", "assiut", "aswan", "beheira", "baniSuef", "cairo",
        "daqahliya", "damietta", "fayyoum", "gharbiya", "giza", "helwan", "ismailia", "kafrelsheikh",
        "luxor", "matrouh", "minya", "monofiya", "newvalley", "northsinai", "portsaid",
        "qalioubiya", "qena", "redsea", "sharqiya", "sohag", "southSinai", "suez", "tanta",];
    
  // handle every inputs when change value
  const namehandler = (e) => {
    setErrorName('');
    setNameValue(e.target.value);
  };
  const mobilehandler = (e) => {
    setErrorMobile('');
    setMobileValue(e.target.value);
  };
  const StreetAddresshandler = (e) => {
    setErrorStreetAddress('');
    setStreetAddressValue(e.target.value);
  };
  const buildinghandler = (e) => {
    setErrorBuilding('');
    setBuildingValue(e.target.value);
  };
  const cityhandler = (e) => {
    setErrorCity('');
    setCityValue(e.target.value);
  };
  const districthandler = (e) => {
    setErrorDistrict('');
    setDistrictValue(e.target.value);
  };
  const governoratehandler = (e) => {
    setErrorGovernorate('');
    setGovernorateValue(e.target.value);
      for (let g of GovernoratesInEgypt) {
        if (g == e.target.value.toLocaleLowerCase()) {
            setCheckValidGovernorate("true");
            break;
          }
        else {
            setCheckValidGovernorate("");
          }
      }
  };

// when click on buttons
    const UseThisAddressHandel = () => {
      const notify = () =>
        toast.success('done, payment method will be visible', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
    if (nameValue.length < 1) {
      setErrorName('Please enter a name.');
    } else {
      setErrorName('');
    }
    if (mobileValue.length != 10) {
      setErrorMobile(
        'Please enter a phone number so we can call if there are any issues with delivery.'
      );
    } else {
      setErrorMobile('');
    }
    if (streetAddressValue.length < 1) {
      setErrorStreetAddress('Please enter an address.');
    } else {
      setErrorStreetAddress('');
    }
    if (buildingValue.length < 1) {
      setErrorBuilding('Please enter an address.');
    } else {
      setErrorBuilding('');
    }
    if (cityValue.length < 1) {
      setErrorCity('Please enter a city name.');
    } else {
      setErrorCity('');
    }
    if (districtValue.length < 1) {
      setErrorDistrict('Please enter a valid area.');
    } else {
      setErrorDistrict('');
    }
    if (GovernorateValue.length > 3) {
        for (let g of GovernoratesInEgypt) {
            if (g == GovernorateValue.toLocaleLowerCase()) {
                setErrorGovernorate('')
                break;
            }else {
                setErrorGovernorate('Please enter a valid Governorate');
            }
        }
        }else {
        setErrorGovernorate('Please enter a state, region, or province.');
    }

// finish step
    if(nameValue && mobileValue.length == 10 && streetAddressValue && buildingValue && cityValue && districtValue && checkValidGovernorate){
      // push shipping data to user cart
      addShippingDataToCart(userId, nameValue, mobileValue, streetAddressValue, buildingValue, cityValue, districtValue, GovernorateValue).then(()=>{
        notify();
        setTimeout(() => {
            setPayment('GoToPayment');
            window.location.href = '#paymentID';
        }, 3000);
      }).catch((err)=>{
        console.log(err)
      })
      } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className='2xl:flex items-center justify-center flex-col '>
        <ToastContainer />
        {/* start Header */}
        <div
          className='h-[60px] mt-2 mx-4
                  bg-gradient-to-t from-[#f6f6f6] to-white
                  border-b-[1px] border-[#DDD] border-solid'
        >
          <div className=' text-[18px] flex justify-between items-center md:pr-10 mt-4 md:ml-20 md:mr-36 sm:text-[28px] font-[400]'>
            <div>
              <Logo />
            </div>
            <div>
              {' '}
              <p>
              {t('Checkout')} (
                <span className='text-[#007185] cursor-pointer'>
                  <span>{cart.cartProductsQuantity} </span>
                  {cart.cartProductsQuantity == 1 ? <span>{t('item')}</span> : <span>{t('items')}</span>}
                </span>
                ){' '}
              </p>{' '}
            </div>
            <div className='max-[500px]:hidden text-[20px]'>
              <FaLock />
            </div>
          </div>
        </div>
        {/* end Header */}
        <div className='lg:mx-[110px] md:mx-[50px] mx-[20px] mt-3 sm:flex md:gap-6'>
          {/* left */}
          <div className='sm:w-3/4 '>
            <div className='text-[18px] text-[#c45500] font-[600]'>
              <span className='mr-3'>1</span>
              <span className='max-[400px]:text-[13px]'>
                {' '}
                {t('Enter a new shipping address')}
              </span>
            </div>
            {/* section one */}
            <div>
              <div className='border border-[#d5d9d9] rounded-[8px] p-4 mt-2 ml-7'>
                <div className='text-[24px] font-[700]'> {t('Add a new address')}</div>
                {/* country */}
                <div className='mt-4 flex flex-col '>
                  <label htmlFor='country' className='font-[700] text-[14px]'>
                  {t('Country/Region')}
                  </label>
                  <input
                    type='text'
                    id='country'
                    className='w-3/4 px-3 py-1 mb-2 mt-1 bg-[#f0f2f2] rounded-lg outline-none
                      shadow-[0_2px_5px_#0f111126]'
                    value={'Egypt'}
                    readOnly
                  />
                </div>
                {/* name */}
                <div className='flex flex-col  mb-2 mt-2'>
                  <label htmlFor='name' className='font-[700] text-[14px] '>
                  {t('Full name (First and Last name)')}
                  </label>
                  {/* handle name */}
                  {errorName ? (
                    <>
                      <input
                        onChange={(e) => {
                          namehandler(e);
                        }}
                        type='text'
                        id='name'
                        placeholder='name'
                        className='w-3/4 p-2 py-0.5  border border-[#cc0c39] outline-none 
                        rounded-[3px] shadow-amazoneInputError'
                      />
                      <div className='flex items-center mt-2 space-x-1 text-[#c40000] text-[13px]'>
                        <span className='text-[20px]'>
                          <IoAlertCircleSharp />
                        </span>
                        <span className='text-[13px]'>{errorName}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        id='name'
                        placeholder='name'
                        onChange={(e) => {
                          namehandler(e);
                        }}
                        className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                        focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                      />
                    </>
                  )}
                </div>
                {/* mobile */}
                <div className='flex flex-col w-3/4 mb-2 mt-2'>
                  <label htmlFor='phone' className='font-[700] text-[14px]'>
                    Mobile number
                  </label>
                  {/* handle mobile */}
                  {errorMobile ? (
                    <>
                      <div className='flex mt-1'>
                        <div
                          className='flex items-center justify-center w-1/6 mr-4 bg-[#f0f2f2] rounded-lg
                          shadow-[0_2px_5px_#0f111126]'
                        >
                          <img
                            className=' w-1/4 '
                            src='../../../public/images/Flag_of_Egypt.png'
                            alt='flagOfEgypt'
                          />
                          <p>+20</p>
                        </div>
                        <input
                          onChange={(e) => {
                            mobilehandler(e);
                          }}
                          type='number'
                          id='phone'
                          placeholder='e.g. 1XXXXXXXXX'
                          className='w-full p-2 py-0.5  border border-[#cc0c39] outline-none 
                            rounded-[3px] shadow-amazoneInputError'
                        />
                      </div>
                      <p className='text-[12px] mt-1'>
                        {t('May be used to assist delivery')}
                      </p>
                      <div className='flex items-center mt-2 space-x-1 text-[#c40000] text-[13px]'>
                        <span className='text-[20px]'>
                          <IoAlertCircleSharp />
                        </span>
                        <span className='text-[13px]'>{errorMobile}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex mt-1'>
                        <div
                          className='flex items-center justify-center w-1/6 mr-4 bg-[#f0f2f2] rounded-lg
                          shadow-[0_2px_5px_#0f111126]'
                        >
                          <img
                            className=' w-1/4 '
                            src='../../../public/images/Flag_of_Egypt.png'
                            alt='flagOfEgypt'
                          />
                          <p>+20</p>
                        </div>
                        <input
                          type='number'
                          id='phone'
                          placeholder='e.g. 1XXXXXXXXX'
                          onChange={(e) => {
                            mobilehandler(e);
                          }}
                          className='w-full p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                        focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                        />
                      </div>
                      <p className='text-[12px] mt-1'>
                        {t('May be used to assist delivery')}
                      </p>
                    </>
                  )}
                </div>
                {/* Street address */}
                <div className='flex flex-col'>
                  <label
                    htmlFor='address'
                    className='font-[700] text-[14px] mb-1'
                  >
                    {t('Street address')}
                  </label>
                  {/* handle Street address */}
                  {errorStreetAddress ? (
                    <>
                      <input
                        onChange={(e) => {
                          StreetAddresshandler(e);
                        }}
                        type='text'
                        id='address'
                        placeholder='e.g Talaat Harb Street'
                        className='w-3/4 p-2 py-0.5  border border-[#cc0c39] outline-none 
                        rounded-[3px] shadow-amazoneInputError'
                      />
                      <div className='flex items-center mt-2 space-x-1 text-[#c40000] text-[13px]'>
                        <span className='text-[20px]'>
                          <IoAlertCircleSharp />
                        </span>
                        <span className='text-[13px]'>
                          {errorStreetAddress}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        id='address'
                        placeholder='e.g Talaat Harb Street'
                        onChange={(e) => {
                          StreetAddresshandler(e);
                        }}
                        className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                        focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                      />
                    </>
                  )}
                </div>
                {/* Building name or number*/}
                <div className='flex flex-col mt-2'>
                  <label
                    htmlFor='BuildingName'
                    className='font-[700] text-[14px] mb-1'
                  >
                    {t('Building name/no')}
                  </label>
                  {/* handle Building */}
                  {errorbuilding ? (
                    <>
                      <input
                        onChange={(e) => {
                          buildinghandler(e);
                        }}
                        type='text'
                        id='BuildingName'
                        placeholder='Building name or number'
                        className='w-3/4 p-2 py-0.5  border border-[#cc0c39] outline-none 
                        rounded-[3px] shadow-amazoneInputError'
                      />
                      <div className='flex items-center mt-2 space-x-1 text-[#c40000] text-[13px]'>
                        <span className='text-[20px]'>
                          <IoAlertCircleSharp />
                        </span>
                        <span className='text-[13px]'>{errorbuilding}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        id='BuildingName'
                        placeholder='Building name or number'
                        onChange={(e) => {
                          buildinghandler(e);
                        }}
                        className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                        focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                      />
                    </>
                  )}
                </div>
                {/* City/Area */}
                <div className='flex flex-col mt-2'>
                  <label htmlFor='City' className='font-[700] text-[14px] mb-1'>
                    {t('City/Area')}
                  </label>
                  {/* City Building */}
                  {errorCity ? (
                    <>
                      <input
                        onChange={(e) => {
                          cityhandler(e);
                        }}
                        type='text'
                        id='City'
                        placeholder='e.g El Nozha, New Cairo City & Dokki'
                        className='w-3/4 p-2 py-0.5 border border-[#cc0c39] outline-none 
                        rounded-[3px] shadow-amazoneInputError'
                      />
                      <p className='text-[12px] mt-1'>
                        {t("Can't find you city/area? Try a different spelling")}
                      </p>
                      <div className='flex items-center mt-2 space-x-1 text-[#c40000] text-[13px]'>
                        <span className='text-[20px]'>
                          <IoAlertCircleSharp />
                        </span>
                        <span className='text-[13px]'>{errorCity}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        id='City'
                        placeholder='e.g El Nozha, New Cairo City & Dokki'
                        onChange={(e) => {
                          cityhandler(e);
                        }}
                        className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                        focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                      />
                    </>
                  )}
                </div>
                {/* District */}
                <div className='flex flex-col mt-2'>
                  <label
                    htmlFor='District'
                    className='font-[700] text-[14px] mb-1'
                  >
                   {t('Checkout')}{t('District')}
                  </label>
                  {/* handle District */}
                  {errorDistrict ? (
                    <>
                      <input
                        onChange={(e) => {
                          districthandler(e);
                        }}
                        type='text'
                        id='District'
                        placeholder='District'
                        className='w-3/4 p-2 py-0.5  border border-[#cc0c39] outline-none 
                        rounded-[3px] shadow-amazoneInputError'
                      />
                      <div className='flex items-center mt-2 space-x-1 text-[#c40000] text-[13px]'>
                        <span className='text-[20px]'>
                          <IoAlertCircleSharp />
                        </span>
                        <span className='text-[13px]'>{errorDistrict}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        id='District'
                        placeholder='District'
                        onChange={(e) => {
                          districthandler(e);
                        }}
                        className='w-3/4 p-2 py-0.5 bg-[#d3d3d3] border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                      />
                    </>
                  )}
                </div>
                {/* Governorate */}
                <div className='flex flex-col mt-2'>
                  <label
                    htmlFor='Governorate'
                    className='font-[700] text-[14px] mb-1'
                  >
                    {t('Governorate')}
                  </label>
                  {/* handle Governorate */}
                  {errorGovernorate ? (
                    <>
                      <input
                        onChange={(e) => {
                          governoratehandler(e);
                        }}
                        type='text'
                        id='Governorate'
                        placeholder='Governorate'
                        className='w-3/4 p-2 py-0.5  border border-[#cc0c39] outline-none 
                        rounded-[3px] shadow-amazoneInputError'
                      />
                      <div className='flex items-center mt-2 space-x-1 text-[#c40000] text-[13px]'>
                        <span className='text-[20px]'>
                          <IoAlertCircleSharp />
                        </span>
                        <span className='text-[13px]'>{errorGovernorate}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        id='Governorate'
                        placeholder='Governorate'
                        onChange={(e) => {
                          governoratehandler(e);
                        }}
                        className='w-3/4 p-2 py-0.5 bg-[#d3d3d3] border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                      />
                    </>
                  )}
                </div>
                {/* Nearest Landmark */}
                <div className='flex flex-col mt-2'>
                  <label
                    htmlFor='NearestLandmark'
                    className='font-[700] text-[14px] mb-1'
                  >
                    {t('Nearest Landmark')}
                  </label>
                  <input
                    type='text'
                    id='NearestLandmark'
                    placeholder='e.g. Cairo festival city'
                    className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                          focus-within:border-amazoneInput'
                  />
                </div>
                <div className='mt-4'>
                  <p className='text-[18px] font-[700]'>
                  {t('Add delivery instructions (optional)')}
                  </p>
                </div>
                <div className='mt-2'>
                  <p className='text-[14px] font-[700]'>{t('Address Type')}</p>
                </div>
                <div className='mb-5 flex'>
                  <div className='mr-12'>
                    <input type='radio' name='addressType' id='home' />
                    <label htmlFor='home'> {t('Home (7am-9pm, all days)')}</label>
                  </div>
                  <div>
                    <input type='radio' name='addressType' id='office' />
                    <label htmlFor='office'>
                      {' '}
                      {t('Office (delivery from Sun-Thu)')}
                    </label>
                  </div>
                </div>
                <div className='mb-5'>
                  <input type='checkbox' id='defaultAddress' />
                  <label
                    htmlFor='defaultAddress'
                    className='font-[700] text-[14px] ml-2'
                  >
                     {t('Use as my default address.')}
                  </label>
                </div>
                <div className='mb-4'>
                  <button
                    onClick={() => {
                      UseThisAddressHandel();
                    }}
                    className=' rounded-lg mx-0.5 px-3 mt-1 text-sm flex items-center justify-center h-8
                        bg-[#FFD814] border border-[#FCD200] 
                         hover:bg-[#F7CA00] hover:border-[#F2C200] hover:cursor-pointer
                          active:bg-[#F0B800] active:border-[#008296] active:shadow-continueButton'
                  >
                    <p>{t('Use this address')}</p>
                  </button>
                </div>
              </div>
            </div>
            {/* section two */}
            <div className='h-[1px] bg-[#BBBFBF] my-4'></div>
            <div className='text-[18px] text-[#565959] font-[700]'>
              <span className='mr-3'>2</span>
              <span id='paymentID'> {t('Payment method')}</span>
              {payment && (
                <div>
                  <Payment />
                </div>
              )}
            </div>
            {/* section three */}
            <div className='h-[1px] bg-[#BBBFBF] my-4'></div>
            <div className='text-[18px] text-[#565959] font-[700]'>
              <span className='mr-3'>3</span>
              <span> {t('Items and shipping')}</span>
            </div>
            <div className='mt-3 mb-10'>
              <p className='text-[12px] border-b-[2px] border-b-[#BBBFBF]'>
                <span className='text-[#5b6169]'>
                  *{t('Why has sales tax been applied?')}{' '}
                </span>
                <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                {t('See tax and seller information.')}
                </span>
              </p>
              <p className='text-[12px] mt-2'>
                <span className='text-[#5b6169]'>{t('Need help? Check our')} </span>
                <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                {t('Help pages')}
                </span>
                <span className='text-[#5b6169]'> or </span>
                <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                {t('contact us')}
                </span>
              </p>
              <p className='text-[12px] mt-2'>
                <span className='text-[#5b6169]'>
                {t("For an item sold by Amazon.com: When you click the 'Place your order' button, we'll send you an email message acknowledging receipt of your order. Your contract to purchase an item will not be complete until we send you an email notifying you that the item has been shipped.")} 
                  </span>
              </p>
              <p className='text-[12px] mt-2'>
                <span className=' text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                {t('Important information about sales tax you may owe in your state')}
                  </span>
              </p>
              <p className='text-[12px] mt-2'>
                <span className='text-[#5b6169]'>
                {t("You may return new, unopened merchandise in original condition within 30 days of delivery. Exceptions and restrictions apply. See Amazon.com's")}{' '}
                </span>
                <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                  {t('Returns Policy.')}
                </span>
              </p>
              <p className='text-[12px] mt-2'>
                <span className='text-[#5b6169]'>
                {t('Need to add more items to your order? Continue shopping on the')}{' '}
                  </span>
                <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                  <Link to={'/home'}>{t('Amazon.com homepage')}</Link>
                </span>
              </p>
            </div>
          </div>
          {/* sidebar */}
          <div className='sm:w-1/4 mx-3 max-h-[600px] rounded-lg sticky top-3 '>
            <div className='px-5 border-[#d5d9d9] border'>
              <div
                className='text-[#6F7373] py-4 rounded-lg h-8 bg-[#FFFAE0] mt-3 mb-2 flex items-center justify-center
                   border border-[#FFED94] shadow-useThisAddressCheckoutpage'
              >
                <p className='text-[13px]'>{t('Use this address')}</p>
              </div>
              <div className='mb-3 text-center'>
                <p className='text-[12px]'>
                  {t("Choose a shipping address to continue checking out. You'll still have a chance to review and edit your order before it's final.")}
                </p>
              </div>
              <div className='h-[1px] bg-[#BBBFBF]'></div>
              <div className='mt-3 mb-4'>
                <p className='text-[19px] font-[700]'>{t("Order Summary")}</p>
              </div>
              <div className='leading-5 mb-1'>
                <div className=' flex justify-between'>
                  <div className='text-[12px]'>{t("Items")} ({cart.cartProductsQuantity}):</div>
                  <div>--</div>
                </div>
                <div className=' flex justify-between'>
                  <div className='text-[12px]'>{t("Shipping & handling:")}</div>
                  <div>--</div>
                </div>
                <div className=' my-1 flex justify-between'>
                  <div></div>
                  <div className='w-3/12 bg-[#BBBFBF] h-[1px]'></div>
                </div>
                <div className=' flex justify-between'>
                  <div className='text-[12px]'>{t("Total before tax:")} </div>
                  <div>{cart.cartTotal}</div>
                </div>
                <div className=' flex justify-between'>
                  <div className='text-[12px]'>
                    {t("Estimated tax to be collected:")}{' '}
                  </div>
                  <div>--</div>
                </div>
              </div>
              <div className='h-[1px] bg-[#BBBFBF]'></div>
              <div className='flex justify-between md:flex-row flex-col text-[#B12704] font-[700] text-[19px] mt-2 mb-4'>
                <div>{t("Order total:")}</div>
                <div className='flex items-center'>
                  <p>${cart.cartTotal}</p>
                </div>
              </div>
            </div>
            <div className='bg-[#f0f2f2]  w-full rounded-b-lg  border-[#d5d9d9] border py-5 flex items-center'>
              <span className='text-[13px] ml-4 text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                <Link to={''}>{t("How are shipping costs calculated?")}</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;