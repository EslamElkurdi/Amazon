import { ProductBadge, ProductRatings } from "./";
import { useTranslation } from 'react-i18next';
import { useSelector   } from "react-redux";
import { i18n } from 'i18next';
import { useEffect } from "react";
const ProductDetails = ({ product, ratings }) => {
  const { t, i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);

  useEffect( ()=>{
    i18n.changeLanguage(language);

  },[language])
  return (
    <div className="mb-1">
      <div className="text-xl xl:text-2xl font-medium mb-1">
        {language=="ar"?product.ar.title:product.en.title}
      </div>
      <div className="text-sm xl:text-base mb-1">
      {language=="ar"?"بواسطة":"by"} <span className="text-blue-500">{language=="ar"?product.ar.brand:product.en.brand}</span>
      </div>
      {ratings && (
        <div className="text-sm xl:text-base mb-1">
          <ProductRatings
            avgRating={product.rating}
            ratings={product.ratingsNumber}
          />
        </div>
      )}
      {/* <div className="text-xs xl:text-sm font-bold mb-1">
        {product.attribute}
      </div> */}
      {/* <div>
        <ProductBadge badge={product.badge} />
      </div> */}
    </div>
  );
};

export default ProductDetails;
