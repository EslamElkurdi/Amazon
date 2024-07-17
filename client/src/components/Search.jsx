import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

import { callAPI } from "../utils/CallApi";
import { getCategories } from "./fireBaseUtils";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';

const Search = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [categorySelectedValue, setCategorySelectedValue] = useState("All");
  const [categoriesArray, setCategoriesArray] = useState([]);

const { t, i18n } = useTranslation();

const language = useSelector((state) => state.language.language);

  useEffect( ()=>{
    i18n.changeLanguage(language);

  },[language])
  const navigate = useNavigate();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    // navigate({
    //   pathname: "search",
    //   search: `${createSearchParams({
    //     category: `${category}`,
    //     searchTerm: `${searchTerm}`,
    //   })}`,
    // });

    // setSearchTerm("");
    // setCategory("All");
    {
      navigate("/Category"+"/"+categorySelectedValue+"?searchParam="+searchTerm);
    };
  };

  const getSuggestions = () => {
    callAPI(`data/suggestions.json`).then((suggestionResults) => {
      setSuggestions(suggestionResults);
    });
  };

  const [cat, setCat] = useState([]);

  useEffect(() => {
    getSuggestions();
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((json) => setCat(json));

    // get categories from fireStore and save it in categoriesArray
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategoriesArray(categories);
    };
    fetchCategories();
    // //
  }, []);

  return (
    <div className="w-[100%] ">
      <div className="flex items-center h-8 bg-amazonclone-yellow rounded">
        <select
          value={categorySelectedValue}
          // onChange={(e) => setCategory(e.target.value)}
          onChange={(e) => setCategorySelectedValue(e.target.value)}
          className="p-1 bg-gray-300 text-black border text-xs xl:text-sm md:max-w-[100px] h-8"
        >
        <option key={"all"} value={"all"}>{language=="ar"?"الكل":"All"}</option>
          {categoriesArray.map((item) => {
            return <option key={item.id} value={item.id}>{language=="ar"?item.ar.name:item.en.name}</option>;
          })}
        </select>
        <input
          className="flex grow items-center h-[100%] rounded-l text-black"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={onHandleSubmit} className="md:w-[45px] w-[40px]">
          <MagnifyingGlassIcon className="h-[27px] m-auto stroke-slate-900" />
        </button>
      </div>
      {suggestions && (
        <div className="bg-white text-black w-full z-40 absolute">
          {suggestions
            .filter((suggestion) => {
              const currentSearchTerm = searchTerm.toLowerCase();
              const title = suggestion.title.toLowerCase();
              return (
                currentSearchTerm &&
                title.startsWith(currentSearchTerm) &&
                title !== currentSearchTerm
              );
            })
            .slice(0, 10)
            .map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => setSearchTerm(suggestion.title)}
              >
                {suggestion.title}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
