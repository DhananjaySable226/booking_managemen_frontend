import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingsService from './bookingsService';

const initialState = {
  bookings: [],
  booking: null,
  loading: false,
  error: null,
  success: false,
  message: '',
  filters: {
    status: '',
    startDate: '',
    endDate: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Create new booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, thunkAPI) => {
    try {
      const response = await bookingsService.createBooking(bookingData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user bookings
export const getUserBookings = createAsyncThunk(
  'bookings/getUserBookings',
  async (params, thunkAPI) => {
    try {
      const response = await bookingsService.getUserBookings(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single booking
export const getBookingById = createAsyncThunk(
  'bookings/getById',
  async (id, thunkAPI) => {
    try {
      const response = await bookingsService.getBookingById(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update booking
export const updateBooking = createAsyncThunk(
  'bookings/update',
  async ({ id, bookingData }, thunkAPI) => {
    try {
      const response = await bookingsService.updateBooking(id, bookingData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async ({ id, reason }, thunkAPI) => {
    try {
      const response = await bookingsService.cancelBooking(id, reason);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Rate booking
export const rateBooking = createAsyncThunk(
  'bookings/rate',
  async ({ id, ratingData }, thunkAPI) => {
    try {
      const response = await bookingsService.rateBooking(id, ratingData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get provider bookings
export const getProviderBookings = createAsyncThunk(
  'bookings/getProviderBookings',
  async (params, thunkAPI) => {
    try {
      const response = await bookingsService.getProviderBookings(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all bookings (admin)
export const getAllBookings = createAsyncThunk(
  'bookings/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await bookingsService.getAllBookings(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Check availability
export const checkAvailability = createAsyncThunk(
  'bookings/checkAvailability',
  async ({ serviceId, date, time }, thunkAPI) => {
    try {
      const response = await bookingsService.checkAvailability(serviceId, date, time);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add booking note
export const addBookingNote = createAsyncThunk(
  'bookings/addNote',
  async ({ id, note }, thunkAPI) => {
    try {
      const response = await bookingsService.addNote(id, note);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get booking notes
export const getBookingNotes = createAsyncThunk(
  'bookings/getNotes',
  async (id, thunkAPI) => {
    try {
      const response = await bookingsService.getBookingNotes(id);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update booking status
export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await bookingsService.updateBookingStatus(id, status);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get booking statistics
export const getBookingStats = createAsyncThunk(
  'bookings/getStats',
  async (params, thunkAPI) => {
    try {
      const response = await bookingsService.getBookingStats(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    clearBooking: (state) => {
      state.booking = null;
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
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.success = true;
        state.message = 'Booking created successfully';
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get user bookings
      .addCase(getUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings || action.payload.data || action.payload || [];
        state.pagination = action.payload.pagination || {};
        state.success = true;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get single booking
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload?.data || action.payload;
        state.success = true;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.booking && state.booking._id === action.payload._id) {
          state.booking = action.payload;
        }
        state.success = true;
        state.message = 'Booking updated successfully';
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.booking && state.booking._id === action.payload._id) {
          state.booking = action.payload;
        }
        state.success = true;
        state.message = 'Booking cancelled successfully';
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Rate booking
      .addCase(rateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.booking && state.booking._id === action.payload._id) {
          state.booking = action.payload;
        }
        state.success = true;
        state.message = 'Rating submitted successfully';
      })
      .addCase(rateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get provider bookings
      .addCase(getProviderBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings || action.payload.data || action.payload || [];
        state.pagination = action.payload.pagination || {};
        state.success = true;
      })
      .addCase(getProviderBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get all bookings
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings || action.payload.data || action.payload || [];
        state.pagination = action.payload.pagination || {};
        state.success = true;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Check availability
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add booking note
      .addCase(addBookingNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookingNote.fulfilled, (state, action) => {
        state.loading = false;
        if (state.booking && state.booking._id === action.payload.bookingId) {
          state.booking.notes = action.payload.notes;
        }
        state.success = true;
        state.message = 'Note added successfully';
      })
      .addCase(addBookingNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get booking notes
      .addCase(getBookingNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingNotes.fulfilled, (state, action) => {
        state.loading = false;
        if (state.booking) {
          state.booking.notes = action.payload;
        }
        state.success = true;
      })
      .addCase(getBookingNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.booking && state.booking._id === action.payload._id) {
          state.booking = action.payload;
        }
        state.success = true;
        state.message = 'Booking status updated successfully';
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get booking stats
      .addCase(getBookingStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(getBookingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { reset, clearBooking, setFilters, clearFilters, setPagination } = bookingsSlice.actions;
export default bookingsSlice.reducer;
