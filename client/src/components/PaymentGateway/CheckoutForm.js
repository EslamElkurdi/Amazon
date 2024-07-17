import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import styles from "./CheckDeisgn.module.css";
import { deleteUserCart, pushOrder } from "../fireBaseUtils";
export default function CheckoutForm() {
  let userId=localStorage.getItem('userId')

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // those two steps must be called after payment success confirmation 
    pushOrder(userId)// you must take this to be called after payment success
    deleteUserCart(userId)// you must take this to be called after payment success
    setTimeout(async () => {
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      setIsProcessing(true);
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/`,
        },
      });
  
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occured.");
      }
  
      setIsProcessing(false);
    }, 2000);// delay for 2 seconds
    // from 9

  };

  return (

    <form id={styles.payment} onSubmit={handleSubmit}>
      <div className="px-20 ">
        <PaymentElement className="p-4" />
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white font-bold py-2 mb-2 px-4 rounded" disabled={isProcessing || !stripe || !elements} id="submit">
            <span id={styles.button}>
              {isProcessing ? "Processing ... " : "Pay now"}
            </span>
          </button>
        </div>
      </div>
      {/* Show any error or success messages */}
      {message && <div id={styles.messages}>{message}</div>}
    </form>
  );
}
