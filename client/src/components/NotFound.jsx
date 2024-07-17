import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    const [showImg, setShowImg] = useState("");
    const arrImg = [
      '../../public/images/notFoundImg/notfound0.jpg',
      '../../public/images/notFoundImg/notFound1.jpg',
      '../../public/images/notFoundImg/notfound2.jpg',
      '../../public/images/notFoundImg/notFound3.jpg',
      '../../public/images/notFoundImg/notFound4.jpg',
      '../../public/images/notFoundImg/notFound5.jpg',
      '../../public/images/notFoundImg/notFound6.jpg',
      '../../public/images/notFoundImg/notFound7.jpg',
      '../../public/images/notFoundImg/notFound8.jpg',
      '../../public/images/notFoundImg/notFound9.jpg',
    ];
    useEffect(() => {
        setShowImg(arrImg[Math.floor(Math.random() * 10)]);
    },[])
    return (
      <>
        <div className=' flex justify-center '>
            <Link to={ "/home" }>
                <div className='mt-6'>
                    <img src='../../public/images/notFoundImg/notFound.png' alt='img1' />
                    <img src={showImg} alt='img2' />
                </div>
            </Link>
        </div>
      </>
    );
};

export default NotFound;