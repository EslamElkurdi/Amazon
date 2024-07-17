import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import { auth } from '../../../../services/firebase';
import { ToastContainer, toast } from 'react-toastify';

const PasswordSecurity = () => {
const navigate = useNavigate();
  const [Password, setPassword] = useState("");

  const PasswordSecurityHandler = (e) => {
    setPassword(e.target.value);
  };
  const notify = () =>
    toast.success('done,Password is changed', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const handleChangePassword = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
         await updatePassword(user,Password)
           .then(() => {
            notify();
            setTimeout(() => {
              navigate('/security');
            }, 3000);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
      else {}
    });
  }
    return (
      <div>
        <div className='w-full flex flex-col items-center mb-5'>
          <div className='mt-4 w-5/12'>
            <div className='mb-4'>
              <p className='mb-3'>
                <Link
                  to={'/account'}
                  className=' hover:cursor-pointer text-[14px] text-[#1874c8] font-[500]
                     hover:text-[#C7511F] hover:underline'
                >
                  Your Account {'>'}{' '}
                </Link>
                <Link
                  to={'/security'}
                  className=' hover:cursor-pointer text-[14px] text-[#1874c8] font-[500]
                     hover:text-[#C7511F] hover:underline'
                >
                  Login & Security {'>'}{' '}
                </Link>
                <span className='text-[#C7511F] text-[14px] font-[400]'>
                  Change password
                </span>
              </p>
              <p className='text-[28px] font-[400]'>Change password</p>
            </div>
            <div className='border border-[#d5d9d9] rounded-lg'>
              <div className='flex flex-col px-5 py-3 justify-between mb-4 gap-4'>
                <div className='text-[13px]'>
                  To change the password for your Amazon account, use this form
                </div>
                <div>
                  <p className='mx-1 mb-1 text-[14px] font-[500]'>
                    New password:
                  </p>
                  <input
                    onChange={PasswordSecurityHandler}
                    type='Password'
                    className=' py-0.5 w-4/12 p-2 mx-0.5 border text-[15px]
                    border-zinc-400 outline-none 
                      rounded-[3px] font-amazone
                      focus-within:shadow-amazoneInput duration-100
                    focus-within:border-amazoneInput'
                  />
                </div>
                <div>
                  <button
                    onClick={() => {
                      handleChangePassword();
                    }}
                    className=' rounded-lg mx-0.5 mt-1 text-sm flex items-center justify-center h-8
                          bg-[#FFD814] border border-[#FCD200] 
                          hover:bg-[#F7CA00] hover:border-[#F2C200] hover:cursor-pointer
                          active:bg-[#F0B800] active:border-[#008296] active:shadow-continueButton'
                  >
                    Save changes
                  </button>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default PasswordSecurity;