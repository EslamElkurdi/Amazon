import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCartTotalQuantityDb,
  getCartTotalQuantityLocalStorage,
  getCategoryById,
  getProductFiltered,
  getProductFilteredInner,
  updateStockAndSold,
} from "../fireBaseUtils";
import ProductRatings from "../ProductRatings";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { i18n } from "i18next";
import { useSelector } from "react-redux";
function Category() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("searchParam");
  const { id } = useParams();
  const [category, setCategory] = useState({});
  const [categoryBrands, setCategoryBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("any");
  const [selectedRating, setSelectedRating] = useState();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredProductsToShow, setFilteredProductsToShow] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    async function awaitGetCategory() {
      const categoryObj = await getCategoryById(id);
      setCategory(categoryObj);
      let { products, productsBrands } = await getProductFiltered(
        id,
        searchParam,
        selectedRating,
        selectedPriceRange,
        selectedBrands
      );
      setCategoryBrands(productsBrands);
      setFilteredProducts(products);
      setFilteredProductsToShow(products.slice(0, Math.min(products.length, 12)));
    }
    awaitGetCategory();
  }, []);

  const handlePriceRangeChange = (event) => {
    setSelectedPriceRange(event.target.value);
  };

  // Function to handle changes in the selected brands
  const handleBrandChange = (event) => {
    const brand = event.target.name;
    const isChecked = event.target.checked;

    // Update selected brands array based on whether the checkbox is checked or unchecked
    if (isChecked) {
      setSelectedBrands((prevSelectedBrands) => [...prevSelectedBrands, brand]);
    } else {
      setSelectedBrands((prevSelectedBrands) =>
        prevSelectedBrands.filter((selectedBrand) => selectedBrand !== brand)
      );
    }
  };

  const handleRatingChange = (clickedRating) => {
    setSelectedRating(clickedRating);
  };

  useEffect(() => {
    async function awaitGetProductsFiltered() {
      let filteredProductsArr = await getProductFilteredInner(
        filteredProducts,
        selectedRating,
        selectedPriceRange,
        selectedBrands
      );
      setPage(1)
      setFilteredProductsToShow(filteredProductsArr.slice((page-1)*12, Math.min(filteredProductsArr.length, page*12)));
    }
    awaitGetProductsFiltered();
  }, [selectedBrands, selectedRating, selectedPriceRange]);

  useEffect(() => {
    async function awaitGetProductsFiltered() {
      let filteredProductsArr = await getProductFilteredInner(
        filteredProducts,
        selectedRating,
        selectedPriceRange,
        selectedBrands
      );
      setFilteredProductsToShow(filteredProductsArr.slice((page-1)*12, Math.min(filteredProductsArr.length, page*12)));
    }
    awaitGetProductsFiltered();
  }, [page]);

  const { t, i18n } = useTranslation();

  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // Function to handle navbar visibility based on screen size

  return Object.keys(category).length == 0 ? (
    <Loader />
  ) : (
    <>
      {/* Navbar for small screens */}

      <nav className="sm:hidden bg-white z-50 p-4 flex flex-col justify-between items-center">
  {/* Hide on screens larger than small */}
  <h1 style={{ fontWeight: "bold", fontSize: "larger" }}>Brands</h1>
  <div className="flex flex-wrap gap-6 items-center">
    {categoryBrands.map((brand) => {
      return (
        <div key={brand} className="flex items-center">
          <input
            type="checkbox"
            id={brand}
            name={brand}
            checked={selectedBrands.includes(brand)}
            onChange={handleBrandChange}
          />
          <label
            htmlFor={brand}
            style={{ fontSize: "20px" }}
            className="ml-1"
          >
            {brand}
          </label>
        </div>
      );
    })}
  </div>
</nav>

      {Object.keys(category).length > 0 && (
        <div className="grid grid-cols-12 gap-4">
          <div className={"hidden sm:block col-span-2 p-4 "}>
            <div>
              <h1>{language == "ar" ? category.ar.name : category.en.name}</h1>
              <span>
                Details about{" "}
                {language == "ar" ? category.ar.name : category.en.name}
              </span>
            </div>
            <br />
            <div>
              <h1>Customer Reviews</h1>
              <div>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => {
                    handleRatingChange(null);
                  }}
                >
                  <input
                    type="radio"
                    name="All Rating"
                    id="All Rating"
                    className="sr-only "
                    value="1"
                  />
                  <label htmlFor="rating1">All Ratings </label>
                </div>
                <div className="flex items-center">
                  <div
                    onClick={() => {
                      handleRatingChange(5);
                    }}
                    className="flex items-center hover:cursor-pointer"
                  >
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    onClick={() => {
                      handleRatingChange(4);
                    }}
                    className="flex items-center hover:cursor-pointer"
                  >
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    onClick={() => {
                      handleRatingChange(3);
                    }}
                    className="flex items-center hover:cursor-pointer"
                  >
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    onClick={() => {
                      handleRatingChange(2);
                    }}
                    className="flex items-center hover:cursor-pointer"
                  >
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    onClick={() => {
                      handleRatingChange(1);
                    }}
                    className="flex items-center hover:cursor-pointer"
                  >
                    <svg
                      className="h-8 w-8 fill-current text-yellow-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                    <svg
                      className="h-8 w-8 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1L12.24 6.45H18.6L13.65 10.55L15.88 16L10 12.75L4.12 16L6.35 10.55L1.4 6.45H7.76L10 1Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <h1 style={{ fontWeight: "bold", fontSize: "larger" }}>Price</h1>
              <div>
                <input
                  type="radio"
                  id="anyPrice"
                  name="price"
                  value="any"
                  checked={selectedPriceRange === "any"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="anyPrice" style={{ fontSize: "20px" }}>
                  Any Price
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="upTo100"
                  name="price"
                  value="upTo100"
                  checked={selectedPriceRange === "upTo100"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="upTo100" style={{ fontSize: "20px" }}>
                  Up to 100 EGP
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="upTo300"
                  name="price"
                  value="upTo300"
                  checked={selectedPriceRange === "upTo300"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="upTo300" style={{ fontSize: "20px" }}>
                  Up to 300 EGP
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="upTo1000"
                  name="price"
                  value="upTo1000"
                  checked={selectedPriceRange === "upTo1000"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="upTo1000" style={{ fontSize: "20px" }}>
                  Up to 1000 EGP
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="upTo3000"
                  name="price"
                  value="upTo3000"
                  checked={selectedPriceRange === "upTo3000"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="upTo3000" style={{ fontSize: "20px" }}>
                  Up to 3000 EGP
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="upTo5000"
                  name="price"
                  value="upTo5000"
                  checked={selectedPriceRange === "upTo5000"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="upTo5000" style={{ fontSize: "20px" }}>
                  Up to 5000 EGP
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="upTo10000"
                  name="price"
                  value="upTo10000"
                  checked={selectedPriceRange === "upTo10000"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="upTo10000" style={{ fontSize: "20px" }}>
                  Up to 10000 EGP
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="above10000"
                  name="price"
                  value="above10000"
                  checked={selectedPriceRange === "above10000"}
                  onChange={handlePriceRangeChange}
                />
                <label htmlFor="above10000" style={{ fontSize: "20px" }}>
                  Above 10000 EGP
                </label>
              </div>
            </div>
            <br />
            <div>
              <h1 style={{ fontWeight: "bold", fontSize: "larger" }}>Brands</h1>
              {categoryBrands.map((brand) => {
                return (
                  <div key={brand}>
                    <input
                      type="checkbox"
                      id={brand}
                      name={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={handleBrandChange}
                    />
                    <label htmlFor={brand} style={{ fontSize: "20px" }}>
                      {brand}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={"col-span-10 p-4"}>
            {filteredProductsToShow.length == 0 ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProductsToShow.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() => {
                      navigate("/product/" + product.productId);
                    }}
                    className="bg-white rounded-lg shadow-lg"
                  >
                    {/* Image and product information */}
                    <div className="p-4 flex flex-col justify-between h-full">
                      <img
                        src={product.images[0]}
                        alt="Product 1"
                        className="w-full h-32 object-cover mb-4"
                        style={{ height: "250px", cursor: "pointer" }}
                      />
                      <div className="mb-4">
                        <h2
                          className="text-xl font-semibold"
                          style={{ cursor: "pointer" }}
                        >
                          {language == "ar"
                            ? product.ar.title
                            : product.en.title}
                        </h2>
                        <p
                          className="text-gray-600 mb-4"
                          style={{ cursor: "pointer" }}
                        >
                          {language == "ar"
                            ? product.ar.description
                            : product.en.description}
                        </p>

                        <span className="text-xl font-semibold">
                          {product.price} $
                        </span>
                        <div className="text-yellow-500">
                          {/* {Array(product.rating)
                            .fill()
                            .map((_, index) => (
                              <FaStar
                                key={index}
                                className="inline-block text-yellow-500"
                              />
                            ))}
                          <span className="ml-1">{product.rating}</span> */}
                          <ProductRatings
                            avgRating={product.rating}
                            // ratings={product.ratingsNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage((page) => page - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((page) => page + 1)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md"
                disabled={filteredProductsToShow.length < 12}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Category;
