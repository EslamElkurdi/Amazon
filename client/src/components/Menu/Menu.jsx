import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { EG } from "country-flag-icons/react/3x2";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch   } from "react-redux";
import { useEffect } from "react";
import { i18n } from 'i18next';
import {
  setLanguageEn,
  setLanguageFr
} from "../../redux/language";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Menue() {


  
  const language = useSelector((state) => state.language.language);
  const { t , i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);

    console.log(language);

  }, [language]);

  const dispatch = useDispatch();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center gap-x-1  bg-amazonclone px-1 py-0.5 text-xs font-semibold text-white-900 shadow-sm ring-gray-300 hover:bg-amazonclone">
          {language === 'en' ? 'En' : 'Ar'}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                
                  onClick={ ()=>dispatch(setLanguageFr())}>
                  ar-العربية
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                
                  onClick={ ()=>dispatch(setLanguageEn())}>
                  En-English
                  <p style={{ color: "blue" }}>Learn more</p>
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <p>
                    {" "}
                    you are shopping on amazon Egypt.com{" "}
                    <EG
                      title="United States"
                      className="..."
                      style={{ height: "20px", width: "20px" }}
                    />
                  </p>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
