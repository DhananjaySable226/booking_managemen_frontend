import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentsService from './paymentsService';

const initialState = {
  payments: [],
  payment: null,
  paymentMethods: [],
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

// Razorpay async thunks
// Create Razorpay order
export const createRazorpayOrder = createAsyncThunk(
  'payments/createRazorpayOrder',
  async (orderData, thunkAPI) => {
    try {
      const response = await paymentsService.createRazorpayOrder(orderData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify Razorpay payment
export const verifyRazorpayPayment = createAsyncThunk(
  'payments/verifyRazorpayPayment',
  async (paymentData, thunkAPI) => {
    try {
      const response = await paymentsService.verifyRazorpayPayment(paymentData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Razorpay payment details
export const getRazorpayPaymentDetails = createAsyncThunk(
  'payments/getRazorpayPaymentDetails',
  async (paymentId, thunkAPI) => {
    try {
      const response = await paymentsService.getRazorpayPaymentDetails(paymentId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Refund Razorpay payment
export const refundRazorpayPayment = createAsyncThunk(
  'payments/refundRazorpayPayment',
  async ({ paymentId, refundData }, thunkAPI) => {
    try {
      const response = await paymentsService.refundRazorpayPayment(paymentId, refundData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Razorpay payment methods
export const getRazorpayPaymentMethods = createAsyncThunk(
  'payments/getRazorpayPaymentMethods',
  async (_, thunkAPI) => {
    try {
      const response = await paymentsService.getRazorpayPaymentMethods();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Razorpay customer
export const createRazorpayCustomer = createAsyncThunk(
  'payments/createRazorpayCustomer',
  async (customerData, thunkAPI) => {
    try {
      const response = await paymentsService.createRazorpayCustomer(customerData);
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
      // Razorpay async thunks
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Razorpay order created successfully';
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.success = true;
        state.message = 'Razorpay payment verified successfully';
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getRazorpayPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRazorpayPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.success = true;
      })
      .addCase(getRazorpayPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(refundRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refundRazorpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(payment => payment._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.payment && state.payment._id === action.payload._id) {
          state.payment = action.payload;
        }
        state.success = true;
        state.message = 'Razorpay payment refunded successfully';
      })
      .addCase(refundRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getRazorpayPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRazorpayPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
        state.success = true;
      })
      .addCase(getRazorpayPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(createRazorpayCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Razorpay customer created successfully';
      })
      .addCase(createRazorpayCustomer.rejected, (state, action) => {
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
      // Get payment stats
      .addCase(getPaymentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentStats.fulfilled, (state) => {
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
  setFilters, 
  clearFilters, 
  setPagination 
} = paymentsSlice.actions;
export default paymentsSlice.reducer;
