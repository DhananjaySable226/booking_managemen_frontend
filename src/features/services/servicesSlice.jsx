import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import servicesService from './servicesService';

const initialState = {
  services: [],
  service: null,
  featuredServices: [],
  loading: false,
  error: null,
  success: false,
  message: '',
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    location: '',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Get all services
export const getServices = createAsyncThunk(
  'services/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await servicesService.getServices(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single service
export const getServiceById = createAsyncThunk(
  'services/getById',
  async (id, thunkAPI) => {
    try {
      const response = await servicesService.getServiceById(id);
      return response;
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
      const response = await servicesService.searchServices(searchParams);
      return response;
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
      const response = await servicesService.getServicesByCategory(category);
      return response;
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
      const response = await servicesService.getFeaturedServices();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create service (for providers/admins)
export const createService = createAsyncThunk(
  'services/create',
  async (serviceData, thunkAPI) => {
    try {
      const response = await servicesService.createService(serviceData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update service (for providers/admins)
export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, serviceData }, thunkAPI) => {
    try {
      const response = await servicesService.updateService(id, serviceData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete service (for providers/admins)
export const deleteService = createAsyncThunk(
  'services/delete',
  async (id, thunkAPI) => {
    try {
      const response = await servicesService.deleteService(id);
      return response;
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
      const response = await servicesService.addReview(serviceId, reviewData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload service images
export const uploadServiceImages = createAsyncThunk(
  'services/uploadImages',
  async ({ serviceId, images }, thunkAPI) => {
    try {
      const response = await servicesService.uploadImages(serviceId, images);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
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
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all services
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.data || action.payload.services || [];
        state.pagination = action.payload.pagination || {};
        state.success = true;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get single service
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload.data || action.payload;
        state.success = true;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Search services
      .addCase(searchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.data || action.payload.services || [];
        state.pagination = action.payload.pagination || {};
        state.success = true;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get services by category
      .addCase(getServicesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.data || action.payload.services || [];
        state.pagination = action.payload.pagination || {};
        state.success = true;
      })
      .addCase(getServicesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get featured services
      .addCase(getFeaturedServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedServices.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredServices = action.payload.data || action.payload || [];
        state.success = true;
      })
      .addCase(getFeaturedServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        const newService = action.payload.data || action.payload;
        state.services.unshift(newService);
        state.success = true;
        state.message = 'Service created successfully';
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const updatedService = action.payload.data || action.payload;
        const index = state.services.findIndex(service => service._id === updatedService._id);
        if (index !== -1) {
          state.services[index] = updatedService;
        }
        if (state.service && state.service._id === updatedService._id) {
          state.service = updatedService;
        }
        state.success = true;
        state.message = 'Service updated successfully';
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(service => service._id !== action.payload.id);
        if (state.service && state.service._id === action.payload.id) {
          state.service = null;
        }
        state.success = true;
        state.message = 'Service deleted successfully';
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add service review
      .addCase(addServiceReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServiceReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.service && state.service._id === action.payload.serviceId) {
          state.service.reviews = action.payload.reviews;
          state.service.rating = action.payload.rating;
        }
        state.success = true;
        state.message = 'Review added successfully';
      })
      .addCase(addServiceReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Upload service images
      .addCase(uploadServiceImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadServiceImages.fulfilled, (state, action) => {
        state.loading = false;
        if (state.service && state.service._id === action.payload.serviceId) {
          state.service.images = action.payload.images;
        }
        state.success = true;
        state.message = 'Images uploaded successfully';
      })
      .addCase(uploadServiceImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { reset, clearService, setFilters, clearFilters, setPagination } = servicesSlice.actions;
export default servicesSlice.reducer;
