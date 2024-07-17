import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../../services/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NameSecurity = () => {
  const navigate = useNavigate();
  const [nameSecurity, setNameSecurity] = useState('');

  const nameSecurityHandler = (e) => {
    setNameSecurity(e.target.value);
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setNameSecurity(user.displayName);
    });
  }, []);
  const notify = () =>
    toast.success('done,Name is changed', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const handleChangeName = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        updateProfile(user, { displayName: nameSecurity });
        notify();
        setTimeout(() => {
            navigate('/security');
            window.location.reload()
        },3000)
      } else { }
    });
  };

 
  
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
                Change your name
              </span>
            </p>
            <p className='text-[28px] font-[400]'>Change your name</p>
          </div>
          <div className='border border-[#d5d9d9] rounded-lg'>
            <div className='flex flex-col px-5 py-3 justify-between mb-4 gap-4'>
              <div className='text-[13px]'>
                If you want to change the name associated with your Amazon
                customer account, you may do so below. Be sure to click the
                <span className='font-[600]'> Save Changes</span> button when
                you are done.
              </div>
              <div>
                <p className='mx-1 mb-1 text-[14px] font-[500]'>New name</p>
                <input
                  onChange={nameSecurityHandler}
                  type='text'
                  value={nameSecurity}
                  className='py-0.5 w-6/12 p-2 mx-0.5 border text-[15px]
                    border-zinc-400 outline-none 
                      rounded-[3px] font-amazone
                      focus-within:shadow-amazoneInput duration-100
                    focus-within:border-amazoneInput'
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    handleChangeName();
                  }}
                  className='rounded-lg mx-0.5 mt-1 text-sm flex items-center justify-center h-8
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

export default NameSecurity;





