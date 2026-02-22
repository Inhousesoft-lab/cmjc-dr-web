import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import rootReducer from "./rootReducer";

// NOTE:
// This project is intentionally light on domain typing right now.
// The exports below (RootState/AppDispatch) make it easy to add strong typing
// incrementally without touching every component at once.

// Persist Redux slice state into SessionStorage.
// Note: SessionStorage is cleared when the browser/tab session ends.
const persistConfig = {
  key: "root",
  version: 1,
  storage: storageSession,
  // If you want to persist only specific slices, uncomment whitelist:
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.MODE !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
