import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
<<<<<<< HEAD
=======
import userSlice from './userSlice'
import postSlice from './postSlice'
import notificationSlice from './notificationSlice'
>>>>>>> d997b8b (Initial commit: project ready for deployment)

import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
<<<<<<< HEAD
=======
    user: userSlice,
    post: postSlice,
    notification: notificationSlice
>>>>>>> d997b8b (Initial commit: project ready for deployment)
})
 
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
<<<<<<< HEAD
=======

// Make store available globally for API interceptors
if (typeof window !== 'undefined') {
    window.store = store;
}

>>>>>>> d997b8b (Initial commit: project ready for deployment)
export default store;