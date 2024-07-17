import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
      <div>
        <Link to={'/'}>
          <img
            src='../../../public/images/Users-Amazon_logo.svg.webp'
            alt='amzone'
            className='w-32 p-3 mt-0.5'
          />
        </Link>
      </div>
    );
};

export default Logo;