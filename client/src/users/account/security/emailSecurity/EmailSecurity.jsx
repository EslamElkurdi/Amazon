import React, { useEffect, useState } from 'react';
import Logo from '../../../../components/componentsAccount/Logo';
import Footer from '../../../../components/componentsAccount/Footer';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../../services/firebase';
import { onAuthStateChanged, verifyBeforeUpdateEmail } from 'firebase/auth';
import { logout } from '../../../../services/auth';
import { ToastContainer, toast } from 'react-toastify';

const EmailSecurity = () => {
  const navigate = useNavigate();
  const [emailSecurity, setEmailSecurity] = useState('');
  const [currentEmailSecurity, setCurrentEmailSecurity] = useState('');

  const emailSecurityHandler = (e) => {
    setEmailSecurity(e.target.value);
  };
const notify = () =>
  toast.info('please, check your gmail and login', {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
   useEffect(() => {
     onAuthStateChanged(auth, (user) => {
       setEmailSecurity(user.email);
       setCurrentEmailSecurity(user.email);
     });
   }, []);
  
  const handleChangeEmail = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await verifyBeforeUpdateEmail(user, emailSecurity)
          .then((user) => {
            notify()
            setTimeout(() => {
              logout();
              localStorage.removeItem("tokens");
              navigate('/login');
            }, 3000);
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {}
    });
  };

  return (
    <div className='w-full flex flex-col items-center'>
      <Logo />
      <div className='w-[360px] mx-auto my-3 flex flex-col items-center'>
        <div className='border border-zinc-200 p-6 w-full rounded-lg'>
          <h2 className='font-[400] text-3xl mb-4'>
            Change your email address
          </h2>
          <p className='text-[14px] mb-3'>
            Current email address: <span>{currentEmailSecurity}</span>
          </p>
          <p className='text-[14px] mb-3'>
            Enter the new email address you would like to associate with your
            account below. We will send a One Time Password (OTP) to that
            address.
          </p>
          <div className='flex flex-col gap-1'>
            <p className='font-[650] text-[13px] mx-0.5'>New email address</p>
            <input
              type='text'
              onChange={emailSecurityHandler}
              value={emailSecurity}
              className='w-full py-0.5 p-2 mx-0.5 border text-[15px]
                    border-zinc-400 outline-none 
                      rounded-[3px] font-amazone
                      focus-within:shadow-amazoneInput duration-100
                    focus-within:border-amazoneInput'
            />
            <div
              className='rounded-lg mt-2 mb-3 text-sm flex  items-center h-8
              bg-[#FFD814] border border-[#FCD200] 
              hover:bg-[#F7CA00] hover:border-[#F2C200] hover:cursor-pointer
              active:bg-[#F0B800] active:border-[#008296] active:shadow-continueButton'
            >
              <button
                onClick={() => {
                  handleChangeEmail();
                }}
                type='submit'
                className='w-full z-10 hover:cursor-pointer'
              >
                Continue
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmailSecurity;