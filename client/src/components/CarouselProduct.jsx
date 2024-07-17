import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import language from "../redux/language";
import { i18n } from 'i18next';
import {
  setLanguageEn,
  setLanguageFr
} from "../redux/language";
import { useSelector } from "react-redux";

const CarouselProduct = ({ topSellerProducts }) => {
  const language = useSelector((state) => state.language.language);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);

    console.log(language);

  }, [language])

  

  return (
<div className="bg-white m-3">
  <div className="text-2xl font-semibold p-3">{language === "ar" ? `الاكثر مبيعا` : `Best Sellers`}</div>
  <Swiper
    slidesPerView={7}
    spaceBetween={10}
    navigation={true}
    modules={[Navigation]}
    breakpoints={{
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
    }}
  >
    {topSellerProducts.map((product) => (
      <SwiperSlide key={product.productId}>
        <Link to={`/product/${product.productId}`}>
          <img
            src={product.images[0]}
            alt="Carousel product"
            style={{ height: "250px" }}
          />
        </Link>
      </SwiperSlide>
    ))}
  </Swiper>
</div>  );
};

export default CarouselProduct;
