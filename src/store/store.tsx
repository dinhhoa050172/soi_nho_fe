// store/index.ts
import { configureStore, combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';

// Root Reducer with reset on logout
const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,
});

// Root Reducer
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (action.type === 'auth/clearAuth') {
    // clear redux-persist cache too
    storage.removeItem('persist:root'); // Optional but ensures persist cache is cleared
    state = undefined;
  }
  return appReducer(state, action);
};

// Persist Config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart', 'user'], // Only persist auth state
    blacklist: [], // Don't persist these reducers
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/PURGE',
                    'persist/REGISTER',
                ],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;