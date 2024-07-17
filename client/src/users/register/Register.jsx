import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoAlertOutline } from 'react-icons/io5';
import { registerUser } from '../../services/auth';
import { sendEmailVerification } from 'firebase/auth';
import Logo from '../../components/componentsAccount/Logo';
import Footer from '../../components/componentsAccount/Footer';
import {updateProfile} from 'firebase/auth';
import { useTranslation } from "react-i18next";
import {  useSelector } from 'react-redux';
import { useEffect } from 'react';

const Register = () => {

  const navigate = useNavigate()

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPass, setClientPass] = useState('');
  const [clientConPass, setClientConPass] = useState('');

  const [errorName, setErrorName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [errorConPass, setErrorConPass] = useState('');
  const [errorEmailInUse, setEmailInUse] = useState('');
  
  // value handler
  const nameHandler = (e) => {
    setClientName(e.target.value);
    setErrorName("")  
  }
  const emailHandler = (e) => {
    setErrorEmail('');
    setClientEmail(e.target.value);
  };
  const passHandler = (e) => {
    setClientPass(e.target.value);
    setErrorPass('');
  };
  const conPassHandler = (e) => {
    setClientConPass(e.target.value);
    setErrorConPass('');
  };

  // form handle
  const registerHandler = async (e) => {
    e.preventDefault();

    // validate name input
    if (clientName.length < 2) {
      setErrorName('Enter your name');
    }

    // validate email input
    if (clientEmail.length == 0) {
      setErrorEmail('Enter your email');
    } else if (clientEmail.match(/^[\w\-]+@([\w]+\.)+[\w]{2,4}$/)) {
      setErrorEmail('');
    } else {
      setErrorEmail(
        'Wrong or Invalid email address.correct and try again.'
      );
    }

    // validate password input
    if (clientPass.length < 6) {
      setErrorPass('Minimum 6 characters required');
    } else {
      setErrorPass('');
    }

    // validate Re-enter password input
    if (clientConPass.length < 6 || clientConPass !== clientPass) {
      setErrorConPass('Type your password again ');
    } else if (clientConPass === clientPass) {
      setErrorConPass('');
    } 
    
    // check Errors state
    if (
      clientName.length > 2 &&
      clientEmail.match(/^[\w\-]+@([\w]+\.)+[\w]{2,4}$/) &&
      clientPass.length >= 6 &&
      clientConPass === clientPass
    ) {
      try {
        await registerUser(clientEmail, clientPass).then(async (userCred) => {
          const user = userCred.user;
          updateProfile(user, {
            displayName: clientName,
          });
          await sendEmailVerification(user);
          navigate('/verifyEmailAddress');
        });
      } catch (err) {
        console.log(err.message);
        setEmailInUse("email already in use,please change email address")
      }
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
    {/* logo component */}
    <Logo />
    {/* form */}
    <form // width or max width
      className=' max-w-[348px]  mx-auto mt-1.5 flex flex-col items-center mb-4'
      onSubmit={(e) => {
        registerHandler(e);
      }}
    >
      <div className='border border-zinc-200 py-2 px-4 w-full rounded-lg'>
        <h2 className='font-[490] text-[28px] mb-3 mx-0.5'>{t("Create account")}</h2>
        <div className='flex flex-col gap-3'>
          {/* name input */}
          <div className='flex flex-col'>
            <p className='font-[650] text-[13px] mb-0.5 mx-1'>{t("Your name")}</p>
            {errorName ? (
              <>
                <input
                  onChange={nameHandler}
                  type='text'
                  autoFocus
                  placeholder='First and last name'
                  className='w-full p-2 py-0.5 mx-0.5 border border-[#cc0c39] outline-none 
                  rounded-[3px] shadow-amazoneInputError'
                />
                <div className='flex items-center space-x-1 text-[#c40000] mt-1'>
                  <span className='text-[15px]'>
                    <IoAlertOutline />
                  </span>
                  <span className='text-[12px]'>{errorName}</span>
                </div>
              </>
            ) : (
              <>
                <input
                  onChange={nameHandler}
                  type='text'
                  autoFocus // value={clientName}
                  placeholder='First and last name'
                  className='w-full py-0.5 p-2 mx-0.5 border text-[15px]
                    border-zinc-400 outline-none 
                      rounded-[3px] font-amazone
                      focus-within:shadow-amazoneInput duration-100
                    focus-within:border-amazoneInput'
                />
              </>
            )}
          </div>
          {/* email input */}
          <div className='flex flex-col gap-1'>
            <p className='font-[650] text-[13px] mx-0.5'>{t("Email")}</p>
            {errorEmail ? (
              <>
                <input
                  onChange={emailHandler}
                  type='text'
                  className='w-full p-2 py-0.5 mx-0.5 border border-[#cc0c39] outline-none 
                  rounded-[3px] shadow-amazoneInputError'
                />
                <div className='flex items-center space-x-1 text-[#c40000] '>
                  <span className='text-[15px]'>
                    <IoAlertOutline />
                  </span>
                  <span className='text-[12px]'>{errorEmail}</span>
                </div>
              </>
            ) : (
              <>
                <input
                  onChange={emailHandler}
                  type='text'
                  placeholder='example@gmail.com'
                  className='w-full p-2 py-0.5 mx-0.5 border border-zinc-400 outline-none 
                            rounded-[3px] focus-within:shadow-amazoneInput duration-100
                           focus-within:border-amazoneInput'
                />
              </>
            )}
          </div>
          {/* password input */}
          <div className='flex flex-col'>
            <p className='font-[650] text-[13px] mb-0.5 mx-1'>{t("Password")}</p>
            {errorPass ? (
              <>
                <input
                  onChange={passHandler}
                  type='password'
                  className='w-full p-2 py-0.5 mx-0.5 border border-[#cc0c39] outline-none 
                  rounded-[3px] shadow-amazoneInputError'
                />
                <div className='flex items-center space-x-1 text-[#c40000] mt-1'>
                  <span className='text-[15px]'>
                    <IoAlertOutline />
                  </span>
                  <span className='text-[12px]'>{errorPass}</span>
                </div>
              </>
            ) : (
              <>
                <input
                  onChange={passHandler}
                  type='password'
                  placeholder='At least 6 characters'
                  className='w-full p-2 py-0.5 mx-0.5 border border-zinc-400 outline-none 
                            rounded-[3px] focus-within:shadow-amazoneInput duration-100
                           focus-within:border-amazoneInput'
                />
                <div className='flex items-center space-x-1 mt-2'>
                  <span className=' text-[#4e74a7] text-[15px]'>
                    <IoAlertOutline />
                  </span>
                  <span className='text-xs'>
                  {t("Passwords must be at least 6 characters.")}
                  </span>
                </div>
              </>
            )}
          </div>
          {/* confirm password input */}
          <div className='flex flex-col'>
            <p className='font-medium text-sm mb-0.5 mx-0.5'>
            {t("Re-enter password")}
            </p>
            {errorConPass ? (
              <>
                <input
                  onChange={conPassHandler}
                  type='password'
                  placeholder='Re-enter password'
                  className='w-full p-2 py-0.5 mx-0.5 border border-[#cc0c39] outline-none 
                  rounded-[3px] shadow-amazoneInputError'
                />
                <div className='flex items-center mt-1 space-x-1 text-[#c40000]'>
                  <span>
                    <IoAlertOutline />
                  </span>
                  <span className='text-xs'>{errorConPass}</span>
                </div>
              </>
            ) : (
              <>
                <input
                  type='password'
                  onChange={conPassHandler}
                  placeholder='Re-enter password'
                  className='w-full p-2 py-0.5 border border-zinc-400 outline-none rounded-[3px]
                        focus-within:shadow-amazoneInput duration-100
                        focus-within:border-amazoneInput'
                />
              </>
            )}
          </div>
          <div
            className='rounded-lg mx-0.5 mt-1 text-sm flex items-center h-8
              bg-[#FFD814] border border-[#FCD200] 
              hover:bg-[#F7CA00] hover:border-[#F2C200] hover:cursor-pointer
              active:bg-[#F0B800] active:border-[#008296] active:shadow-continueButton'
          >
            <input
              type='submit'
              className='w-full z-10 hover:cursor-pointer text-[13px]'
              value={'Continue'}
            />
          </div>
          {errorEmailInUse && (
              <div className='flex items-center text-[#c40000]'>
                <span>
                  <IoAlertOutline />
                </span>
                <span className='text-xs'>{errorEmailInUse}</span>
            </div>
          )}
          <div>
            <p className='text-xs mt-3 mx-1'>
            {t("By creating an account, you agree to Amazon's")}{' '}
              <Link
                to={''}
                className='text-[#0066c0] hover:underline hover:text-[#c45500] cursor-pointer'
              >
                {t("Conditions of Use")}{''}
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
          </div>
          <div className='w-full h-[1px] bg-zinc-300 mt-5 shadow-createButton'></div>
          <div>
            <p className='font-[600] text-[13px]'>{t("Buying for work?")}</p>
            <p>
              <Link
                to={''}
                className='text-[#0066c0] font-[600] text-[13px]
                hover:underline hover:text-[#c45500] cursor-pointer'
              >
                {t("Create a free business account")}
              </Link>
            </p>
          </div>
          <div className='w-10/12 m-auto h-[1px] bg-zinc-300 mt-2 shadow-line'></div>
          <div className='mt-3 text-[13px] font-[500] '>
            <p>
            {t("Already have an account?")}{' '}
              <Link
                to={'/login'}
                className='text-[#0066c0] hover:underline hover:text-[#c45500] cursor-pointer'
              >
                {t("Sign in")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
    {/* footer component */}
    <Footer />
  </div>
);
};

export default Register;