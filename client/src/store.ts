import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import schduleReducer from "./slices/schedule";

const store = configureStore({
  reducer: {
    auth: authReducer,
    schedule: schduleReducer,
  },
  devTools: true,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
