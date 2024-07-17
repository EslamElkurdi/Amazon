import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoAlertOutline } from 'react-icons/io5';
import { sendPassResetEmail } from '../../services/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../components/componentsAccount/Logo';
import Footer from '../../components/componentsAccount/Footer';

const ResetPassword = () => {
  const navigate = useNavigate();
  
  const [clientpasswordAssistance, setClientpasswordAssistance] = useState('');
  const [errorpasswordAssistance, seterrorpasswordAssistance] = useState('');
  
  const passwordAssistanceHandler = (e) => {
        setClientpasswordAssistance(e.target.value);
        seterrorpasswordAssistance('')
  }
  const notify = () =>
    toast.info('check your gmail ,and login with new password', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    const registerHandler = async (e) => {
        e.preventDefault();
        if (clientpasswordAssistance.length == 0) {
            seterrorpasswordAssistance("Enter your gmail")
        }
        else if (!clientpasswordAssistance.match(/^[\w\-]+@([\w]+\.)+[\w]{2,4}$/)) {
            seterrorpasswordAssistance('invalid, please write your correct gmail ');
        }
        else {
          seterrorpasswordAssistance("")
          sendPassResetEmail(clientpasswordAssistance).then(()=> {
            notify();
            setTimeout(() => {
              navigate('/login');
            },3000)
            }).catch((err) => {
                console.log(err.message);
            })
        }
    };
return (
  <div className='w-full flex flex-col items-center'>
    <Logo />
    <form
      className='w-[348px] mx-auto mb-7 flex flex-col items-center'
      onSubmit={(e) => {
        registerHandler(e);
      }}
    >
      <ToastContainer />
      <div className='border border-zinc-200 p-6 w-full rounded-lg'>
        <h2 className='font-[400] text-[27px] font-amazone'>
          Password assistance
        </h2>
        <p className='text-[13px] font-[500] mb-3'>
          Enter the email address associated with your
          Amazon account.
        </p>
        <div className='flex flex-col gap-1'>
          <p className='font-[650] text-[13px] mx-0.5'>
            Email 
          </p>
          {errorpasswordAssistance ? (
            <>
              <input
                onChange={passwordAssistanceHandler}
                type='text'
                autoFocus
                className='w-full p-2 py-0.5 mx-0.5 border border-[#cc0c39] outline-none 
                    rounded-[3px] shadow-amazoneInputError'
              />
              <div className='flex items-center space-x-1 text-[#c40000]'>
                <span className='text-[15px]'>
                  <IoAlertOutline />
                </span>
                <span className='text-[12px]'>{errorpasswordAssistance}</span>
              </div>
            </>
          ) : (
            <>
              <input
                onChange={passwordAssistanceHandler}
                type='text'
                autoFocus
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
        </div>
      </div>
      <div className=' w-full mt-3'>
        <div className='font-[400] text-[17px]'>
          Has your email changed?
        </div>
        <div className='text-[13px]'>
          If you no longer use the email address associated with your Amazon
          account,you may contact{' '}
          <Link
            to={''}
            className='underline text-center text-[#0066c0] hover:text-[#c45500]'
          >
            Customer Service
          </Link>{' '}
          for help restoring access to your account.
        </div>
      </div>
    </form>
    <Footer />
  </div>
);};

export default ResetPassword;