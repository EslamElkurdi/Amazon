import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: 'en',
  
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    
    // change to en
    setLanguageEn: (state) => {
        state.language = 'en';
    }

    // change to fr
    ,setLanguageFr:(state)=>{
        console.log(state.language);
        state.language='ar';
    }
    
  },
});

export const { setLanguageEn, setLanguageFr } =
  languageSlice.actions;
export default languageSlice.reducer;
