import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from '../../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Security = () => {
  const [nameSecurity, setNameSecurity] = useState('');
  const [emailSecurity, setEmailSecurity] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setNameSecurity(user.displayName)
      setEmailSecurity(user.email);
    })
  }, [])
    return (
      <div>
        <div className='flex flex-col items-center mb-5'>
          <div className='mt-7 w-5/12'>
            <div className='mb-2'>
              <p className='mb-3'>
                <Link
                  to={'/account'}
                  className=' hover:cursor-pointer text-[14px] text-[#007185] font-[400]
                     hover:text-[#C7511F] hover:underline'
                >
                  Your Account{'>'}
                </Link>
                <span className='text-[#C7511F] text-[14px] font-[400]'>
                  {' '}
                  Login & Security
                </span>
              </p>
              <p className='text-[28px] font-[400]'>Login & Security</p>
            </div>
            <div className='border border-[#d5d9d9] rounded-lg'>
              <div className='flex md:flex-row flex-col flex-wrap items-center px-3 py-3 justify-between mb-4 '>
                <div className='max-w-[153px]'>
                  <p className='text-[14px] font-[600]'>Name</p>
                  <p className='text-[10px] sm:text-[14px] font-[400]'>
                    {nameSecurity}
                  </p>
                </div>
                <div className='flex'>
                  <Link to={'/nameSecurity'}>
                    <p
                      className='text-[13px] mt-2 font-[400] sm:px-14 px-5 py-1 rounded-lg shadow-EditButton
                       border border-[#D5D9D9] hover:bg-[#F7FAFA]'
                    >
                      Edit
                    </p>
                  </Link>
                </div>
              </div>
              <div className='h-0.5 w-full bg-[#e7e7e7]'></div>
              <div className='flex md:flex-row flex-col flex-wrap items-center px-3 py-3 justify-between mb-4'>
                <div className='flex flex-col items-center md:block'>
                  <p className='text-[14px] font-[600]'>Email</p>
                  <p className='text-[10px] sm:text-[14px] font-[400]'>
                    {emailSecurity}
                  </p>
                </div>
                <div className='flex'>
                  <Link to={'/emailSecurity'}>
                    <p
                      className='text-[13px] mt-2 font-[400] sm:px-14 px-5 py-1 rounded-lg shadow-EditButton
                       border border-[#D5D9D9] hover:bg-[#F7FAFA]'
                    >
                      Edit
                    </p>
                  </Link>
                </div>
              </div>
              <div className='h-0.5 w-full bg-[#e7e7e7]'></div>
              <div className='flex md:flex-row flex-col flex-wrap items-center px-3 py-3 justify-between mb-4'>
                <div className='max-w-[153px] flex flex-col items-center md:block'>
                  <p className='text-[14px] font-[600]'>Password</p>
                  <input
                    className='text-[14px] font-[400] w-1/2 border border-none outline-none'
                    value={ '123123' }
                    readOnly
                    onChange={() => {}}
                    type='password'
                  />
                </div>
                <div className='flex'>
                  <Link to={'/passwordSecurity'}>
                    <p
                      className='text-[13px] mt-2 font-[400] sm:px-14 px-5 py-1 items-center rounded-lg shadow-EditButton
                       border border-[#D5D9D9] hover:bg-[#F7FAFA]'
                    >
                      Edit
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Security;