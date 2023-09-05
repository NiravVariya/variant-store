import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import en from "../../public/locales/en/common.json";
import ar from "../../public/locales/ar/common.json";

const initialState = {
  userDetails: {
    changed: false,
  } as any,
  search: "",
  mobileSearch: "",
  range: [] as number[],
  categorie: "",
  allProductData: [] as string[],
  filterProductData: [] as string[],
  subCategorie: "",
  sortValue: "" as string,
  storeSetData: [] as string[],
  storeSetDataRef: "",
  en: en,
  ar: ar,
  clearData: "",
  currency: "USD",
  cart: [] as any[],
  orderData: [] as string[],
  startDate: "",
  endDate: "",
  variantList: [] as any[],
  variantCombinationList: [] as any[]
};

export const iconslice = createSlice({
  name: "searchList",
  initialState,
  reducers: {
    setUserDetails: (state: any, action: any) => {
      state.userDetails = action.payload;
      state.userDetails.changed = true;
    },
    setSearch: (state: any, action: any) => {
      state.search = action.payload;
    },
    setMobileSearch: (state: any, action: any) => {
      state.mobileSearch = action.payload;
    },
    setRange: (state: any, action: any) => {
      state.range = action.payload;
    },
    setAllProductData: (state: any, action: any) => {
      state.allProductData = action.payload;
    },
    setFilterProductData: (state: any, action: any) => {
      state.filterProductData = action.payload;
    },
    setCategorie: (state: any, action: any) => {
      state.categorie = action.payload;
    },
    setSubCategorie: (state: any, action: any) => {
      state.subCategorie = action.payload;
    },
    setSortValue: (state: any, action: any) => {
      state.sortValue = action.payload;
    },
    setStoreSetData: (state: any, action: any) => {
      state.storeSetData = action.payload;
    },
    setStoreSetDataRef: (state: any, action: any) => {
      state.storeSetDataRef = action.payload;
    },
    setEnglishTrans: (state, action) => {
      state.en = action.payload;
    },
    setArabicTrans: (state, action) => {
      state.ar = action.payload;
    },
    setCleardata: (state, action) => {
      state.categorie = "";
      state.subCategorie = "";
      state.sortValue = "";
      state.range = [0, 10000];
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setOrderData: (state: any, action: any) => {
      state.orderData = action.payload;
    },
    setStartDate: (state: any, action: any) => {
      state.startDate = action.payload;
    },
    setEndDate: (state: any, action: any) => {
      state.endDate = action.payload;
    },
    setVariantList: (state: any, action: any) => {
      state.variantList = action.payload;
    },
    setVariantCombinationList: (state: any, action: any) => {
      state.variantCombinationList = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    icon: iconslice.reducer,
  },
});

export default store;

export const {
  setStartDate,
  setEndDate,
  setUserDetails,
  setSearch,
  setCategorie,
  setAllProductData,
  setRange,
  setFilterProductData,
  setSubCategorie,
  setSortValue,
  setStoreSetData,
  setStoreSetDataRef,
  setEnglishTrans,
  setArabicTrans,
  setCleardata,
  setCurrency,
  setCart,
  setOrderData,
  setMobileSearch,
  setVariantList,
  setVariantCombinationList
} =
  iconslice.actions;
