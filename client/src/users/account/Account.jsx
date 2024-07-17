import React from 'react';
import { Link } from 'react-router-dom';

const Account = () => {
  return (
    <>
      <div className='w-full flex flex-col items-center mb-40'>
        <div className='mt-3 w-9/12'>
          <div className='mb-3'>
            <p className='font-[400] text-[28px]'>Your Account</p>
          </div>
          <div className='flex flex-row gap-5 flex-wrap'>
            <Link className='w-[320px] border rounded-lg' to={'/orders'}>
              <div className=' flex flex-row hover:bg-[#eee] h-full py-3'>
                <img
                  src='./../../../public/images/users-order._CB660668735_.png'
                  className='ms-3 w-1/4 my-2'
                />
                <div>
                  <p>Your Orders</p>
                  <p>
                    Track, return, cancel an order, download invoice or buy
                    again
                  </p>
                </div>
              </div>
            </Link>
            <Link className='w-[320px] border rounded-lg' to={'/security'}>
              <div className='flex flex-row hover:bg-[#eee] h-full py-3'>
                <img
                  src='./../../../public/images/users-security._CB659600413_.png'
                  className='ms-3 w-1/4 my-2'
                />
                <div>
                  <div> Login & security</div>
                  <p>Edit login, name, and mobile number</p>
                </div>
              </div>
            </Link>
            <Link className='w-[320px] border rounded-lg' to={'/payment'}>
              <div className=' flex flex-row hover:bg-[#eee] h-full py-3'>
                <img
                  src='./../../../public/images/users-payment._CB660668735_.png'
                  className='ms-3 w-1/4 my-2'
                />
                <div>
                  <p>Your Payments</p>
                  <p>
                    View all transactions, manage payment methods and settings
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Account;