import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { i18n } from "i18next";
import { setLanguageEn, setLanguageFr } from "../redux/language";

const HomePageCard = ({ categoryId, title, img, link }) => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState("ltr"); // Default direction is left-to-right

  const categoryClicked = (categoryId) => {
    navigate("/Category" + "/" + categoryId);
  };

  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; // Set document direction
  }, [language]);

  return (
    <div
      className="h-[420px] bg-white z-30 m-3 hover:cursor-pointer"
      onClick={() => {
        categoryClicked(categoryId);
      }}
    >
      <div className="text-lg xl:text-xl font-semibold ml-4 mt-4">{title}</div>
      <div className="h-[300px] m-4">
        <img
          className="h-[100%] w-[100%] object-cover"
          src={img}
          alt="Home card"
        />
      </div>
      <div className="text-xs xl:text-sm text-blue-400 ml-4">{link}</div>
    </div>
  );
};

export default HomePageCard;
