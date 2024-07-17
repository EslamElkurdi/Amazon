import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useNavigate, createSearchParams } from "react-router-dom";

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
const CarouselCategory = () => {
  const navigate = useNavigate();
  const searchCategory = (category) => {
    navigate({
      pathname: "search",
      search: `${createSearchParams({
        category: `${category}`,
        searchTerm: ``,
      })}`,
    });
  };
  const language = useSelector((state) => state.language.language);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);

    console.log(language);

  }, [language])


  return (
    <div className="bg-white m-3">
      <div className="text-2xl font-semibold p-3">{language=="ar"?`تسوق من خلال التصنيف`:`Shop By Category`}</div>
      <Swiper
        slidesPerView={5}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
      >
        <SwiperSlide
          onClick={() => searchCategory("Deals")}
          className="cursor-pointer"
        >
          <img src={"../images/category_0.jpg"} alt="Deal category" />
        </SwiperSlide>
        <SwiperSlide
          onClick={() => searchCategory("Amazon")}
          className="cursor-pointer"
        >
          <img src={"../images/category_1.jpg"} alt="Amazon category" />
        </SwiperSlide>
        <SwiperSlide
          onClick={() => searchCategory("Fashion")}
          className="cursor-pointer"
        >
          <img src={"../images/category_2.jpg"} alt="Fashion category" />
        </SwiperSlide>
        <SwiperSlide
          onClick={() => searchCategory("Computers")}
          className="cursor-pointer"
        >
          <img src={"../images/category_3.jpg"} alt="Computers category" />
        </SwiperSlide>
        <SwiperSlide
          onClick={() => searchCategory("Home")}
          className="cursor-pointer"
        >
          <img src={"../images/category_4.jpg"} alt="Home category" />
        </SwiperSlide>
        <SwiperSlide
          onClick={() => searchCategory("Mobiles")}
          className="cursor-pointer"
        >
          <img src={"../images/category_5.jpg"} alt="Mobiles category" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default CarouselCategory;
