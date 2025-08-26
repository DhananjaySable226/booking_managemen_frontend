import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

const initialState = {
  dashboardStats: null,
  revenueAnalytics: null,
  bookingAnalytics: null,
  userAnalytics: null,
  serviceAnalytics: null,
  systemHealth: null,
  loading: false,
  error: null,
  success: false,
  message: '',
};

// Get dashboard statistics
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getDashboardStats(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get revenue analytics
export const getRevenueAnalytics = createAsyncThunk(
  'admin/getRevenueAnalytics',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getRevenueAnalytics(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get booking analytics
export const getBookingAnalytics = createAsyncThunk(
  'admin/getBookingAnalytics',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getBookingAnalytics(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user analytics
export const getUserAnalytics = createAsyncThunk(
  'admin/getUserAnalytics',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getUserAnalytics(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get service analytics
export const getServiceAnalytics = createAsyncThunk(
  'admin/getServiceAnalytics',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getServiceAnalytics(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get system health
export const getSystemHealth = createAsyncThunk(
  'admin/getSystemHealth',
  async (_, thunkAPI) => {
    try {
      const response = await adminService.getSystemHealth();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Send bulk notifications
export const sendBulkNotifications = createAsyncThunk(
  'admin/sendBulkNotifications',
  async (notificationData, thunkAPI) => {
    try {
      const response = await adminService.sendBulkNotifications(notificationData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Export data
export const exportData = createAsyncThunk(
  'admin/exportData',
  async (exportParams, thunkAPI) => {
    try {
      const response = await adminService.exportData(exportParams);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update system settings
export const updateSystemSettings = createAsyncThunk(
  'admin/updateSystemSettings',
  async (settings, thunkAPI) => {
    try {
      const response = await adminService.updateSystemSettings(settings);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get admin notifications
export const getAdminNotifications = createAsyncThunk(
  'admin/getNotifications',
  async (params, thunkAPI) => {
    try {
      const response = await adminService.getNotifications(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark notification as read
export const markNotificationRead = createAsyncThunk(
  'admin/markNotificationRead',
  async (notificationId, thunkAPI) => {
    try {
      const response = await adminService.markNotificationRead(notificationId);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    clearAnalytics: (state) => {
      state.dashboardStats = null;
      state.revenueAnalytics = null;
      state.bookingAnalytics = null;
      state.userAnalytics = null;
      state.serviceAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
        state.success = true;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get revenue analytics
      .addCase(getRevenueAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRevenueAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueAnalytics = action.payload;
        state.success = true;
      })
      .addCase(getRevenueAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get booking analytics
      .addCase(getBookingAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingAnalytics = action.payload;
        state.success = true;
      })
      .addCase(getBookingAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get user analytics
      .addCase(getUserAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.userAnalytics = action.payload;
        state.success = true;
      })
      .addCase(getUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get service analytics
      .addCase(getServiceAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceAnalytics = action.payload;
        state.success = true;
      })
      .addCase(getServiceAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get system health
      .addCase(getSystemHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSystemHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.systemHealth = action.payload;
        state.success = true;
      })
      .addCase(getSystemHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Send bulk notifications
      .addCase(sendBulkNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendBulkNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Notifications sent successfully';
      })
      .addCase(sendBulkNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Export data
      .addCase(exportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Data exported successfully';
      })
      .addCase(exportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update system settings
      .addCase(updateSystemSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Settings updated successfully';
      })
      .addCase(updateSystemSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get admin notifications
      .addCase(getAdminNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(getAdminNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Mark notification as read
      .addCase(markNotificationRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Notification marked as read';
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { reset, clearAnalytics } = adminSlice.actions;
export default adminSlice.reducer;
