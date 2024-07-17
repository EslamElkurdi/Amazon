import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { getCartProductsForPayment } from "../fireBaseUtils";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem('userId'));// replace with userId

  useEffect(() => {
    fetch("/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey)); 
    });
  }, []);

  useEffect(() => {
    async function getCartProductsAndCreatePaymentIntent(userId) {
      try {
          const cartProducts = await getCartProductsForPayment(userId);
          console.log(cartProducts,"cartProducts")
          return cartProducts
      } catch (error) {
          console.error("Error in payment component:", error);
      }}
      getCartProductsAndCreatePaymentIntent(userId)
    .then(cartTotal => {
    console.log(cartTotal, "products pay");
    // Here you can use the resolved data
    fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          // Required properties for your payment service
          amount: cartTotal*100, // Replace with your actual total amount
          currency: "eur", // Replace with your desired currency code (e.g., "eur", "jpy")
          // Optional properties depending on your service and needs
          description: "Your product or service description",
        }),
    }).then(async (result) => {
    
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
      console.log("succcesss333")
    }).catch(err => console.log("Error in payment component",err));
    })
    .catch(error => {
    console.error(error); // Handle any potential errors
    });
      }, []);
    
  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
