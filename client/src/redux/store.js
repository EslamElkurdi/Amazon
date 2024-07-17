import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import languageReducer from "./language";

export default configureStore({
  reducer: {
    cart: cartReducer,
    language: languageReducer,
  },
});
