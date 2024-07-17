import React from "react";
import "./Footer.css";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";

function Footer() {

  const language = useSelector((state) => state.language.language);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);

    console.log(language);

  }, [language])


  return (
    <footer>
      <a href="#" className="back-to-top">
        {t('Back to top')}
      </a>
      <section className="footer-first-mobile-section">
        {/* <!-- for mobile --> */}
        <span className="">
          <p>{t('Get to Know Us')}</p>
          <p>{t('Get to Know Us')}</p>
          <p>{t('Get to Know Us')}</p>
          <p>{t('Get to Know Us')}</p>
        </span>
        <span className="">
          <p>{t('Get to Know Us')}</p>
          <p>{t('Get to Know Us')}</p>
          <p>{t('Get to Know Us')}</p>
          <p>{t('Get to Know Us')}</p>
        </span>
      </section>
      <section className="footer-first-section">
        <span className="">
          <p>{t('Get to Know Us')}</p>
          <div>
            <a href="">{t('Careers')}</a>
          </div>
          <div>
            <a href="">{t('About Us')}</a>
          </div>
          <div>
            <a href="">{t('UK Modern Slavery Statement')}</a>
          </div>
          <div>
            <a href="">{t('Amazon Science')}</a>
          </div>
        </span>
        <span className="">
          <p>{t('Make Money with Us')}</p>
          <div>
            <a href="">{t('Sell on Amazon')}</a>
          </div>
          <div>
            <a href="">{t('Sell on Amazon Business')}</a>
          </div>
          <div>
            <a href="">{t('Sell on Amazon Handmade')}</a>
          </div>
          <div>
            <a href="">{t('Sell on Amazon Launchpad')}</a>
          </div>
          <div>
            <a href="">{t('Associates Programme')}</a>
          </div>
          <div>
            <a href="">{t('Fulfilment by Amazon')}</a>
          </div>
          <div>
            <a href="">{t('Seller Fulfilled Prime')}</a>
          </div>
          <div>
            <a href="">{t('Advertise Your Products')}</a>
          </div>
          <div>
            <a href="">{t('Independently Publish with Us')}</a>
          </div>
          <div>
            <a href="">{t('Amazon Pay')}</a>
          </div>
          <div>
            <a href="">{t('Host an Amazon Hub')}</a>
          </div>
          <div>
            <a href="">{t('See More Make Money with Us')}</a>
          </div>
        </span>
        <span className="">
          <p>{t('Amazon Payment Methods')}</p>
          <div>
            <a href="">{t('Amazon Platinum Mastercard')}</a>
          </div>
          <div>
            <a href="">{t('Amazon Classic Mastercard')}</a>
          </div>
          <div>
            <a href="">{t('Amazon Money Store')}</a>
          </div>
          <div>
            <a href="">{t('Gift Cards')}</a>
          </div>
          <div>
            <a href="">{t('Amazon Currency Converter')}</a>
          </div>
          <div>
            <a href="">{t('Payment Methods Help')}</a>
          </div>
          <div>
            <a href="">{t('Shop with Points')}</a>
          </div>
          <div>
            <a href="">{t('Top Up Your Account')}</a>
          </div>
          <div>
            <a href="">{t('Top Up Your Account in Store')}</a>
          </div>
        </span>
        <span className="">
          <p>{t('Let Us Help You')}</p>
          <div>
            <a href="">{t('COVID-19 and Amazon')}</a>
          </div>
          <div>
            <a href="">{t('Track Packages or View Orders')}</a>
          </div>
          <div>
            <a href="">{t('Delivery Rates & Policies')}</a>
          </div>
          <div>
            <a href="">{t('Returns & Replacements')}</a>
          </div>
          <div>
            <a href="">{t('Recycling')}</a>
          </div>
          <div>
            <a href="">{t('Manage Your Content and Devices')}</a>
          </div>
          <div>
            <a href="">{t('Amazon Mobile App')}</a>
          </div>
          <div>
            <a href="">{t('Amazon Assistant')}</a>
          </div>
          <div>
            <a href="">{t('Customer Service')}</a>
          </div>
          <div>
            <a href="">{t('Accessibility')}</a>
          </div>
        </span>
      </section>

      <section className="footer-second-section">
        <a href="">
          <img src={"../images/amazon.png"} alt={t('amazon logo')} />
        </a>
        <span>
          <div>
            <a href="">{t('Australia')}</a>
          </div>{" "}
          <div>
            <a href="">{t('Brazil')}</a>
          </div>{" "}
          <div>
            <a href="">{t('Canada')}</a>
          </div>
          <div>
            <a href="">{t('China')}</a>
          </div>
          <div>
            <a href="">{t('France')}</a>
          </div>
          <div>
            <a href="">{t('Germany')}</a>
          </div>
          <div>
            <a href="">{t('India')}</a>
          </div>
          <div>
            <a href="">{t('Italy')}</a>
          </div>
          <div>
            <a href="">{t('Japan')}</a>
          </div>
          <div>
            <a href="">{t('Mexico')}</a>
          </div>
          <div>
            <a href="">{t('Netherlands')}</a>
          </div>
          <div>
            <a href="">{t('Poland')}</a>
          </div>
          <div>
            <a href="">{t('Singapore')}</a>
          </div>
          <div>
            <a href="">{t('Spain')}</a>
          </div>
          <div>
            <a href="">{t('Turkey')}</a>
          </div>
          <div>
            <a href="">{t('United Arab Emirates')}</a>
          </div>
          <div>
            <a href="">{t('United States')}</a>
          </div>
        </span>
      </section>

      <section className="footer-third-mobile-section">
        <p>{t('Already a customer?')}</p>
        <a href="">{t('Sign in')}</a>
      </section>
      <section className="footer-third-section">
        <span>
          <a href="">
            <p>{t('Amazon Music')}</p>
            <p>{t('Stream millions of songs')}</p>
          </a>
          <a href="">
            <p>{t('Audible')}</p>
            <p>{t('Download Audiobooks')}</p>
          </a>
          <a href="">
            <p>{t('Kindle Direct Publishing')}</p>
            <p>{t('Indie Digital & Print Publishing Made Easy')}</p>
          </a>
        </span>
        <span>
          <a href="">
            <p>{t('AbeBooks')}</p>
            <p>{t('Books, art & collectables')}</p>
          </a>
          <a href="">
            <p>{t('Goodreads')}</p>
            <p>{t('Book reviews & recommendations')}</p>
          </a>
          <a href="">
            <p>{t('Shopbop')}</p>
            <p>{t('Designer Fashion Brands')}</p>
          </a>
          <a href="">
            <p>{t('Whole Foods Market')}</p>
            <p>{t('We Believe in Real Food')}</p>
          </a>
        </span>
        <span>
          <a href="">
            <p>{t('ACX')}</p>
            <p>{t('Audiobook Publishing Made Easy')}</p>
          </a>
          <a href="">
            <p>{t('Amazon Home Services')}</p>
            <p>{t('Experienced pros Happiness Guarantee')}</p>
          </a>
          <a href="">
            <p>{t('Amazon Warehouse')}</p>
            <p>{t('Deep Discounts Open-Box Products')}</p>
          </a>
        </span>
        <span>
          <a href="">
            <p>{t('Amazon Web Services')}</p>
            <p>{t('Scalable Cloud Computing Services')}</p>
          </a>
          <a href="">
            <p>{t('IMDb')}</p>
            <p>{t('Movies, TV & Celebrities')}</p>
          </a>
          <a href="">
            <p>{t('Amazon Business')}</p>
            <p>{t('Service for business customers')}</p>
          </a>
        </span>
      </section>

      <section className="footer-fourth-section">
        <span>
          <div>
            <a href="">{t('Conditions of Use & Sale')}</a>
          </div>
          <div>
            <a href="">{t('Privacy Notice')}</a>
          </div>
          <div>
            <a href="">{t('Cookies Notice')}</a>
          </div>
          <div>
            <a href="">{t('Interest-Based Ads Notice')}</a>
          </div>
        </span>
        <p>© 1996-2024, Amazon.com, Inc. or its affiliates</p>
      </section>

    </footer>
  );
}

export default Footer;
