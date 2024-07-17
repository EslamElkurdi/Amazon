import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
      <>
        <div className=' w-10/12 m-auto h-[1px] bg-zinc-300 mt-2 shadow-line'></div>
        <div className='w-full text-xs mx-auto flex justify-center mb-2 mt-6 h-max'>
          <div>
            <div className='flex flex-row text-[12px]'>
              <Link
                to={''}
                className='mx-6 hover:underline text-[#0066c0] hover:text-[#c45500] cursor-pointer'
              >
                Conditions of Use
              </Link>
              <Link
                to={''}
                className='hover:underline text-[#0066c0] hover:text-[#c45500] cursor-pointer'
              >
                Privacy Notice
              </Link>
              <Link
                to={''}
                className='mx-6 hover:underline text-[#0066c0] hover:text-[#c45500] cursor-pointer'
              >
                Help
              </Link>
            </div>
            <div className='flex justify-center mt-3 mb-7 text-[#555] text-[12px] '>
              <p>© 1996-2024, Amazon.com, Inc. or its affiliates</p>
            </div>
          </div>
        </div>
      </>
    );
};

export default Footer;