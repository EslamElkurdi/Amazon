import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowDropright } from 'react-icons/io';
import Footer from '../../components/componentsAccount/Footer';
import Logo from '../../components/componentsAccount/Logo';
import { IoAlertOutline } from 'react-icons/io5';
import { useTranslation } from "react-i18next";
import {  useSelector } from 'react-redux';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const [clientEmail, setClientEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

    const emailHandler = (e) => {
      setClientEmail(e.target.value);
      setErrorEmail('');
    };
  const LoginHandler = async (e) => {
    e.preventDefault();
    if (clientEmail.length == 0) {
      setErrorEmail('Enter your email or mobile phone number');
    } else if (clientEmail.match(/^[\w\-]+@([\w]+\.)+[\w]{2,4}$/)) {
      setErrorEmail('');
      localStorage.setItem('email', clientEmail);
      navigate('/loginPassword');
    } else {
      setErrorEmail('Invalid email address. correct and try again.');
    }
  };


    // 
    const language = useSelector((state) => state.language.language);
    const { t, i18n } = useTranslation();
    useEffect(() => {
      i18n.changeLanguage(language);
  
      console.log(language);
  
    }, [language])

  return (
    <div className='w-full flex flex-col items-center'>
      <Logo />
      <form
        className='max-w-[348px]  mx-auto  flex flex-col items-center'
        onSubmit={(e) => {
          LoginHandler(e);
        }}
      >
        <div className='border border-zinc-200 p-6 w-full rounded-lg'>
          <h2 className='font-[400] text-3xl mb-4'>{t("Sign in")}</h2>
          <div className='flex flex-col gap-1'>
            <p className='font-[650] text-[13px] mx-0.5'>{t("Email")}</p>
            {errorEmail ? (
              <>
                <input
                  onChange={emailHandler}
                  type='text'
                  autoFocus
                  className='w-full p-2 py-0.5 mx-0.5 border border-[#cc0c39] outline-none 
                    rounded-[3px] shadow-amazoneInputError'
                />
                <div className='flex items-center  text-[#c40000]'>
                  <span className='text-[15px]'>
                    <IoAlertOutline />
                  </span>
                  <span className='text-[14px]'>{errorEmail}</span>
                </div>
              </>
            ) : (
              <>
                <input
                  onChange={emailHandler}
                  type='text'
                  autoFocus
                  placeholder='example@gmail.com'
                  className='w-full py-0.5 p-2 mx-0.5 border text-[15px]
                    border-zinc-400 outline-none 
                      rounded-[3px] font-amazone
                      focus-within:shadow-amazoneInput duration-100
                    focus-within:border-amazoneInput'
                />
              </>
            )}
            <div
              className='rounded-lg mt-2 mb-3 text-sm flex  items-center h-8
              bg-[#FFD814] border border-[#FCD200] 
              hover:bg-[#F7CA00] hover:border-[#F2C200] hover:cursor-pointer
              active:bg-[#F0B800] active:border-[#008296] active:shadow-continueButton'
            >
              <input
                type='submit'
                className='w-full z-10 hover:cursor-pointer'
                value={'Continue'}
              />
            </div>
            <p className='text-xs '>
            {t("By continuing, you agree to Amazon's")}
              <Link
                to={''}
                className='text-[#0066c0] hover:underline hover:text-[#c45500] cursor-pointer'
              >
                {' '}
                {t("Conditions of")} <span>&nbsp;&nbsp;</span> {t("Use")}{' '}
              </Link>
              {t("and")}
              <Link
                to={''}
                className='text-[#0066c0] hover:underline hover:text-[#c45500] cursor-pointer'
              >
                {' '}
                {t("Privacy Notice")}
              </Link>
              .
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className='text-sm mt-5  cursor-pointer overflow-hidden focus:overflow-visible focus:h-10 focus:mb-5  h-5 duration-1000'
            >
              <p className='flex flex-row items-center '>
                <span>
                  <IoMdArrowDropright />
                </span>
                <span className='hover:underline text-[#0066c0] hover:text-[#c45500]'>
                {t("Need Help?")}
                </span>
              </p>
              <p className='flex mx-3 flex-col items-start '>
                <Link
                  to={'/resetPassword'}
                  className='hover:underline text-[#0066c0] hover:text-[#c45500] cursor-pointer'
                >
                  {t("forget password?")}
                </Link>
                <Link
                  to={''}
                  className='hover:underline text-[#0066c0] hover:text-[#c45500] cursor-pointer'
                >
                  {t("Other issues with Sign-In")}
                </Link>
              </p>
            </button>
            <div className='w-full h-[1px] bg-zinc-300 mt-5 mb-3 shadow-createButton'></div>
            <div>
              <p className='font-[600] text-[13px]'>{t("Buying for work?")}</p>
              <p>
                <Link
                  to={''}
                  className='text-[#0066c0] font-[600] text-[13px]
                hover:underline hover:text-[#c45500] cursor-pointer'
                >
                  {t("Shop on Amazon Business")}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className='w-full text-xs mt-5 flex items-center text-gray-600'>
          <span className='w-1/3 h-[1px] bg-zinc-300'></span>
          <span className='w-1/3 text-center'>{t("")}New to Amazon?</span>
          <span className='w-1/3 h-[1px] bg-zinc-300'></span>
        </p>
        <Link
          to={'/register'}
          className='shadow-createButton text-sm w-full text-center
                    border border-[#D5D9D9] rounded-lg mt-3 mb-3 py-1
                    hover:bg-[#F7FAFA]
                    hover:border-[#D5D9D9]
                    focus-within:shadow-amazoneInput duration-100
                    focus:border-amazoneInput'
        >
          {t("Create your Amazon account")}
        </Link>
      </form>
      <Footer />
    </div>
  );
};

export default Login;