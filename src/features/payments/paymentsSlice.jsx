import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentsService from './paymentsService';

const initialState = {
  payments: [],
  payment: null,
  paymentMethods: [],
  paymentIntent: null,
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

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'payments/createIntent',
  async (paymentData, thunkAPI) => {
    try {
      const response = await paymentsService.createPaymentIntent(paymentData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'payments/confirm',
  async ({ paymentIntentId, paymentMethodId }, thunkAPI) => {
    try {
      const response = await paymentsService.confirmPayment(paymentIntentId, paymentMethodId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payment history
export const getPaymentHistory = createAsyncThunk(
  'payments/getHistory',
  async (params, thunkAPI) => {
    try {
      const response = await paymentsService.getPaymentHistory(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payment details
export const getPaymentDetails = createAsyncThunk(
  'payments/getDetails',
  async (paymentId, thunkAPI) => {
    try {
      const response = await paymentsService.getPaymentDetails(paymentId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Refund payment
export const refundPayment = createAsyncThunk(
  'payments/refund',
  async ({ paymentId, refundData }, thunkAPI) => {
    try {
      const response = await paymentsService.refundPayment(paymentId, refundData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Stripe customer
export const createStripeCustomer = createAsyncThunk(
  'payments/createCustomer',
  async (customerData, thunkAPI) => {
    try {
      const response = await paymentsService.createStripeCustomer(customerData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payment methods
export const getPaymentMethods = createAsyncThunk(
  'payments/getPaymentMethods',
  async (_, thunkAPI) => {
    try {
      const response = await paymentsService.getPaymentMethods();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add payment method
export const addPaymentMethod = createAsyncThunk(
  'payments/addPaymentMethod',
  async (paymentMethodData, thunkAPI) => {
    try {
      const response = await paymentsService.addPaymentMethod(paymentMethodData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update payment method
export const updatePaymentMethod = createAsyncThunk(
  'payments/updatePaymentMethod',
  async ({ paymentMethodId, paymentMethodData }, thunkAPI) => {
    try {
      const response = await paymentsService.updatePaymentMethod(paymentMethodId, paymentMethodData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete payment method
export const deletePaymentMethod = createAsyncThunk(
  'payments/deletePaymentMethod',
  async (paymentMethodId, thunkAPI) => {
    try {
      const response = await paymentsService.deletePaymentMethod(paymentMethodId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Set default payment method
export const setDefaultPaymentMethod = createAsyncThunk(
  'payments/setDefaultPaymentMethod',
  async (paymentMethodId, thunkAPI) => {
    try {
      const response = await paymentsService.setDefaultPaymentMethod(paymentMethodId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payment statistics
export const getPaymentStats = createAsyncThunk(
  'payments/getStats',
  async (params, thunkAPI) => {
    try {
      const response = await paymentsService.getPaymentStats(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all payments (admin)
export const getAllPayments = createAsyncThunk(
  'payments/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await paymentsService.getAllPayments(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    clearPayment: (state) => {
      state.payment = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
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
      // Create payment intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntent = action.payload;
        state.success = true;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.paymentIntent = null;
        state.success = true;
        state.message = 'Payment confirmed successfully';
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get payment history
      .addCase(getPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.pagination = action.payload.pagination;
        state.success = true;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get payment details
      .addCase(getPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.success = true;
      })
      .addCase(getPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Refund payment
      .addCase(refundPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(payment => payment._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.payment && state.payment._id === action.payload._id) {
          state.payment = action.payload;
        }
        state.success = true;
        state.message = 'Payment refunded successfully';
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Create Stripe customer
      .addCase(createStripeCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStripeCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Customer created successfully';
      })
      .addCase(createStripeCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get payment methods
      .addCase(getPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
        state.success = true;
      })
      .addCase(getPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Add payment method
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods.push(action.payload);
        state.success = true;
        state.message = 'Payment method added successfully';
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update payment method
      .addCase(updatePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.paymentMethods.findIndex(method => method._id === action.payload._id);
        if (index !== -1) {
          state.paymentMethods[index] = action.payload;
        }
        state.success = true;
        state.message = 'Payment method updated successfully';
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete payment method
      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = state.paymentMethods.filter(method => method._id !== action.payload.id);
        state.success = true;
        state.message = 'Payment method deleted successfully';
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Set default payment method
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = state.paymentMethods.map(method => ({
          ...method,
          isDefault: method._id === action.payload._id
        }));
        state.success = true;
        state.message = 'Default payment method updated successfully';
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get payment stats
      .addCase(getPaymentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(getPaymentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get all payments
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.pagination = action.payload.pagination;
        state.success = true;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { 
  reset, 
  clearPayment, 
  clearPaymentIntent, 
  setFilters, 
  clearFilters, 
  setPagination 
} = paymentsSlice.actions;
export default paymentsSlice.reducer;
