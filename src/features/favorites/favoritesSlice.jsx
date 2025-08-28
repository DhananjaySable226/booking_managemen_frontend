import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoritesService from './favoritesService';

const initialState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, thunkAPI) => {
    try {
        const res = await favoritesService.getFavorites();
        return res.data || [];
    } catch (err) {
        const message = err.response?.data?.message || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const addToFavorites = createAsyncThunk('favorites/add', async (serviceId, thunkAPI) => {
    try {
        const res = await favoritesService.addFavorite(serviceId);
        return res.data || [];
    } catch (err) {
        const message = err.response?.data?.message || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const removeFromFavorites = createAsyncThunk('favorites/remove', async (serviceId, thunkAPI) => {
    try {
        const res = await favoritesService.removeFavorite(serviceId);
        return res.data || [];
    } catch (err) {
        const message = err.response?.data?.message || err.message || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchFavorites.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.items = action.payload || [];
            })
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.items = action.payload || [];
            });
    }
});

export default favoritesSlice.reducer;


