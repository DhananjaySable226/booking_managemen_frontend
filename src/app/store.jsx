import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import authReducer from '../features/auth/authSlice';
import servicesReducer from '../features/services/servicesSlice';
import bookingReducer from '../features/bookings/bookingsSlice';
import cartReducer from '../features/cart/cartSlice';
import paymentReducer from '../features/payments/paymentsSlice';
import uiReducer from '../features/ui/uiSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import adminReducer from '../features/admin/adminSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart', 'favorites'], // Persist favorites for quick UI
};

const rootReducer = combineReducers({
    auth: authReducer,
    services: servicesReducer,
    bookings: bookingReducer,
    cart: cartReducer,
    payments: paymentReducer,
    ui: uiReducer,
    favorites: favoritesReducer,
    admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
