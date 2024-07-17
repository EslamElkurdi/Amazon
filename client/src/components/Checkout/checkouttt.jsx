import React, { useEffect, useState } from 'react';
import Logo from '../componentsAccount/Logo';
import { FaLock } from 'react-icons/fa';
import { auth } from '../../services/firebase';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
const Checkout = () => {
    const itemsNumber = useSelector((state) => state.cart.productsNumber);
    console.log(itemsNumber);
  const dispatch = useDispatch();
    const namehandler = (e) => {
        // setNameOfUser(e.target.value)
    }


    const language = useSelector((state) => state.language.language);
    const { t, i18n } = useTranslation();
    useEffect(() => {
      i18n.changeLanguage(language);
  
      console.log(language);
  
    }, [language])


    return (
      <>
        <div className='2xl:flex items-center justify-center flex-col '>
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
                  {t('Checkout')}(
                  <span className='text-[#007185] cursor-pointer'>
                    <span>{itemsNumber}{" "}</span>{itemsNumber==1?(<span>{t('item')}</span>):(<span>{t('items')}</span>)}
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
          <div className='sm:mx-[115px] mt-3  flex gap-1'>
            {/* left */}
            <div className=' w-2/3 '>
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
                  <div className='text-[24px] font-[700]'>
                  {t('Add a new address')}
                  </div>
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
                  <div>
                    <label htmlFor='name' className='font-[700] text-[14px] '>
                    {t('Full name (First and Last name)')}
                    </label>
                    <input
                      type='text'
                      id='name'
                      placeholder='name'
                      onChange={(e) => {
                        namehandler(e);
                      }}
                      //   placeholder='name' //change name from auth
                      className='w-3/4 p-2 py-0.5 mt-1 border border-zinc-400 outline-none rounded-[3px]
                        focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                    />
                  </div>
                  <div className='flex flex-col w-3/4 mb-2 mt-2'>
                    <label htmlFor='phone' className='font-[700] text-[14px]'>
                    {t('Mobile number')}
                    </label>
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
                        className='w-full p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                          focus-within:border-amazoneInput'
                      />
                    </div>
                    <p className='text-[12px] mt-1'>
                    {t('May be used to assist delivery')}
                    </p>
                  </div>
                  {/* Street address */}
                  <div className='flex flex-col'>
                    <label
                      htmlFor='address'
                      className='font-[700] text-[14px] mb-1'
                    >
                      {t('Street address')}
                    </label>
                    <input
                      type='text'
                      id='address'
                      placeholder='e.g Talaat Harb Street'
                      className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                          focus-within:border-amazoneInput'
                    />
                  </div>
                  {/* Building name or number*/}
                  <div className='flex flex-col mt-2'>
                    <label
                      htmlFor='BuildingName'
                      className='font-[700] text-[14px] mb-1'
                    >
                      {t('Building name/no')}
                    </label>
                    <input
                      type='text'
                      id='BuildingName'
                      placeholder='Building name or number'
                      className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                          focus-within:border-amazoneInput'
                    />
                  </div>
                  {/* City/Area */}
                  <div className='flex flex-col mt-2'>
                    <label
                      htmlFor='City'
                      className='font-[700] text-[14px] mb-1'
                    >
                      {t('City/Area')}
                    </label>
                    <input
                      type='text'
                      id='City'
                      placeholder='e.g El Nozha, New Cairo City & Dokki'
                      className='w-3/4 p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                          focus-within:border-amazoneInput'
                    />
                    <p className='text-[12px] mt-1'>
                    {t("Can't find you city/area? Try a different spelling")}
                    </p>
                  </div>
                  {/* District */}
                  <div className='flex flex-col mt-2'>
                    <label
                      htmlFor='District'
                      className='font-[700] text-[14px] mb-1'
                    >
                      {t('Checkout')}District
                    </label>
                    <input
                      type='text'
                      id='District'
                      placeholder='District'
                      className='w-3/4 p-2 py-0.5 bg-[#d3d3d3] border border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                          focus-within:border-amazoneInput'
                    />
                  </div>
                  {/* Governorate */}
                  <div className='flex flex-col mt-2'>
                    <label
                      htmlFor='Governorate'
                      className='font-[700] text-[14px] mb-1'
                    >
                      {t('Governorate')}
                    </label>
                    <input
                      type='text'
                      id='Governorate'
                      placeholder='Governorate'
                      className='w-3/4 p-2 py-0.5 border bg-[#d3d3d3] border-zinc-400 outline-none rounded-[3px]
                          focus-within:shadow-amazoneInput duration-100
                          focus-within:border-amazoneInput'
                    />
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
                      <label htmlFor='home'>{t('Home (7am-9pm, all days)')} </label>
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
                <span>{t('Payment method')} </span>
              </div>
              {/* section three */}
              <div className='h-[1px] bg-[#BBBFBF] my-4'></div>
              <div className='text-[18px] text-[#565959] font-[700]'>
                <span className='mr-3'>3</span>
                <span> {t('Items and shipping')}</span>
              </div>
              <div className='mt-3'>
                <p className='text-[13px]'>
                  <span className='text-[#5b6169]'>
                  {t('Why has sales tax been applied?')}{' '}
                  </span>
                  <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                  {t('See tax and seller information.')}
                  </span>
                </p>
                <p className='text-[13px] mt-2'>
                  <span className='text-[#5b6169]'>{t('Need help? Check our')} </span>
                  <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                  {t('Help pages')}
                  </span>
                  <span className='text-[#5b6169]'> or </span>
                  <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                  {t('contact us')}
                  </span>
                </p>
                <p className='text-[14.5px] mt-2'>
                  <span className='text-[#5b6169]'>
                  {t("For an item sold by Amazon.com: When you click the 'Place your order' button, we'll send you an email message acknowledging receipt of your order. Your contract to purchase an item will not be complete until we send you an email notifying you that the item has been shipped.")} 
                  </span>
                </p>
                <p className='text-[13px] mt-2'>
                  <span className=' text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                  {t('Important information about sales tax you may owe in your state')}
                  </span>
                </p>
                <p className='text-[13px] mt-2'>
                  <span className='text-[#5b6169]'>
                  {t("You may return new, unopened merchandise in original condition within 30 days of delivery. Exceptions and restrictions apply. See Amazon.com's")}{' '}
                  </span>
                  <span className='text-[#007185] hover:text-[#C7511F] hover:cursor-pointer hover:underline'>
                  {t('Checkout')}
                  </span>
                </p>
                <p className='text-[13px] mt-2'>
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
            <div className='bg-green-400'></div>
          </div>
        </div>
      </>
    );
};

export default Checkout;