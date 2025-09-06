import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "@/state/slices/authSlice";
import servicesReducer from "@/state/slices/servicesSlice";
import ordersReducer from "@/state/slices/ordersSlice";
import bookingReducer from "@/state/slices/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    orders: ordersReducer,
    booking: bookingReducer,
  },
  devTools: import.meta.env?.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
