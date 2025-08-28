import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceService from './serviceService';

const initialState = {
    services: [],
    service: null,
    isLoading: false,
    isError: false,
    message: '',
    filters: {
        category: '',
        priceRange: '',
        rating: '',
        location: '',
        startDate: '',
        endDate: ''
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    }
};

// Get all services
export const getServices = createAsyncThunk(
    'services/getAll',
    async (filters, thunkAPI) => {
        try {
            return await serviceService.getServices(filters);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get single service
export const getService = createAsyncThunk(
    'services/getOne',
    async (id, thunkAPI) => {
        try {
            return await serviceService.getService(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create service
export const createService = createAsyncThunk(
    'services/create',
    async (serviceData, thunkAPI) => {
        try {
            return await serviceService.createService(serviceData);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update service
export const updateService = createAsyncThunk(
    'services/update',
    async ({ id, serviceData }, thunkAPI) => {
        try {
            return await serviceService.updateService(id, serviceData);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete service
export const deleteService = createAsyncThunk(
    'services/delete',
    async (id, thunkAPI) => {
        try {
            return await serviceService.deleteService(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Search services
export const searchServices = createAsyncThunk(
    'services/search',
    async (searchParams, thunkAPI) => {
        try {
            return await serviceService.searchServices(searchParams);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get services by category
export const getServicesByCategory = createAsyncThunk(
    'services/getByCategory',
    async (category, thunkAPI) => {
        try {
            return await serviceService.getServicesByCategory(category);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get featured services
export const getFeaturedServices = createAsyncThunk(
    'services/getFeatured',
    async (_, thunkAPI) => {
        try {
            return await serviceService.getFeaturedServices();
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Add service review
export const addServiceReview = createAsyncThunk(
    'services/addReview',
    async ({ serviceId, reviewData }, thunkAPI) => {
        try {
            return await serviceService.addServiceReview(serviceId, reviewData);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get provider services
export const getProviderServices = createAsyncThunk(
    'services/getProviderServices',
    async (providerId, thunkAPI) => {
        try {
            return await serviceService.getProviderServices(providerId);
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get current user's services (for service providers)
export const getMyServices = createAsyncThunk(
    'services/getMyServices',
    async (_, thunkAPI) => {
        try {
            return await serviceService.getMyServices();
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        clearService: (state) => {
            state.service = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            // Get all services
            .addCase(getServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services = action.payload.services;
                state.pagination = action.payload.pagination;
            })
            .addCase(getServices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get single service
            .addCase(getService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.service = action.payload;
            })
            .addCase(getService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create service
            .addCase(createService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services.unshift(action.payload);
            })
            .addCase(createService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update service
            .addCase(updateService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const index = state.services.findIndex(service => service._id === action.payload._id);
                if (index !== -1) {
                    state.services[index] = action.payload;
                }
                if (state.service && state.service._id === action.payload._id) {
                    state.service = action.payload;
                }
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete service
            .addCase(deleteService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services = state.services.filter(service => service._id !== action.payload.id);
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Search services
            .addCase(searchServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services = action.payload.services;
                state.pagination = action.payload.pagination;
            })
            .addCase(searchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get services by category
            .addCase(getServicesByCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getServicesByCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services = action.payload.services;
                state.pagination = action.payload.pagination;
            })
            .addCase(getServicesByCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get featured services
            .addCase(getFeaturedServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFeaturedServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services = action.payload;
            })
            .addCase(getFeaturedServices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Add service review
            .addCase(addServiceReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addServiceReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                if (state.service && state.service._id === action.payload._id) {
                    state.service = action.payload;
                }
            })
            .addCase(addServiceReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get provider services
            .addCase(getProviderServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProviderServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services = action.payload.data || action.payload;
            })
            .addCase(getProviderServices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get my services
            .addCase(getMyServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.services = action.payload.data || action.payload;
            })
            .addCase(getMyServices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset, clearService, setFilters, clearFilters, setPagination } = serviceSlice.actions;
export default serviceSlice.reducer;
