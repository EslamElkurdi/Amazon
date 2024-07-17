import React, { useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import { auth } from '../../../services/firebase';
import Logo from '../../../components/componentsAccount/Logo';
import Footer from '../../../components/componentsAccount/Footer';

const VerifyEmailAddress = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkForVerifiedInterval = setInterval(() => {
      auth.currentUser.reload().then((ok) => {
        if (auth.currentUser.emailVerified) {
            localStorage.setItem('tokens', auth.currentUser.accessToken);
            localStorage.setItem('userId', auth.currentUser.uid);
            localStorage.setItem('userEmail', auth.currentUser.email);
            navigate("/home");
            clearInterval(checkForVerifiedInterval);
            Location.reload()
        }
      });
    }, 1000);
  },[])
  return (
    <div className='w-full flex flex-col items-center'>
      <Logo />
      <form className='w-[350px] mx-auto mb-10 flex flex-col items-center'>
        <div className='border border-zinc-200 p-6 w-full rounded-lg'>
          <h2 className='font-medium text-3xl mb-2 font-amazone'>
            verify Email Address
          </h2>
            <div className='flex flex-col '>
              <p className='text-sm'>
                To verify your email ,check your gmail we've sent a link .
              </p>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default VerifyEmailAddress;
