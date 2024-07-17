import { useEffect, useState } from "react";
import { Carousel, HomePageCard, CarouselCategory, CarouselProduct } from "./";
import { getCategories, getTopSellerProducts } from "./fireBaseUtils";
import { useTranslation } from 'react-i18next';
import { useSelector   } from "react-redux";
import { i18n } from 'i18next';
import {
  setLanguageEn,
  setLanguageFr
} from "../redux/language";
import Loader from "./Loader/Loader";
const HomePage = () => {
  
  // const [cat, setCat] = useState([]);
  
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [topSellerProducts, setTopSellerProducts] = useState([]);// from 8 
  // change language
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // fetch("https://fakestoreapi.com/products/categories")
    //   .then((res) => res.json())
    //   .then((json) => setCat(json));

      // get categories from fireStore and save it in categoriesArray
      const fetchCategoriesAndTopSeller = async () => {// from 8 
        const categories = await getCategories();
        setCategoriesArray(categories);
        // from 8 
        getTopSellerProducts().then((topSeller)=>{
          setTopSellerProducts(topSeller);
        }
        )
        // from 8 
      };
      fetchCategoriesAndTopSeller();// from 8 
      // //
  }, []);

  
  const language = useSelector((state) => state.language.language);

  useEffect( ()=>{
    i18n.changeLanguage(language);

  },[language])

  useEffect(() => {// from 8 
    console.log(topSellerProducts);
  }, [topSellerProducts]);
  return (
    <div className="bg-amazonclone-background min-h-[700px]">
      {categoriesArray.length==0?<Loader/>:(
      <div className=" m-auto">
        <Carousel />
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 -mt-80">
          
          {/* {cat.map((item, index) => {
            return (
              <HomePageCard
                key={index}
                title={item}
                img={"../images/home_grid_1.jpg"}
                link={"See terms and conditions"}
              />
            );
          })} */}
          {categoriesArray.map((category) => {
            return (
              <HomePageCard
                key={category.id}
                categoryId={category.id}
                title={language=="ar"?category.ar.name:category.en.name}
                img={category.img}
                link={t("See terms and conditions")}
              />
            );
          })}

          {/* <HomePageCard
            title={"Watch The Rings of Power"}
            img={"../images/home_grid_2.jpg"}
            link={"Start streaming now"}
          />
          <HomePageCard
            title={"Watch The Rings of Power"}
            img={"../images/home_grid_2.jpg"}
            link={"Start streaming now"}
          />
          <HomePageCard
            title={"Unlimited Streaming"}
            img={"../images/home_grid_3.jpg"}
            link={"Find out more"}
          />
          <HomePageCard
            title={"More titles to explore"}
            img={"../images/home_grid_4.jpg"}
            link={"Browse Kindle Unlimited"}
          /> */}

          <div className="m-3 pt-8">
            <img
              className="xl:hidden"
              src={"../images/banner_image_2.jpg"}
              alt="Banner 2"
            />
          </div>
        </div>
        {/* // from 8 */}
        {topSellerProducts.length>0&&<CarouselProduct topSellerProducts={topSellerProducts}/>}
        {/* // from 8 */}
        <CarouselCategory />
        <div className="h-[200px]">
          <img
            className="h-[100%] m-auto"
            src={"../images/banner_image.jpg"}
            alt="Banner 1"
          />
        </div>
      </div>)}
    </div>
  );
};

export default HomePage;
