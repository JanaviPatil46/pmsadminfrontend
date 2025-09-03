// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import accountContactReducer from "./accountContactSlice";

const store = configureStore({
  reducer: {
    accountContact: accountContactReducer,
  },
});

export default store;
