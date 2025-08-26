import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Modal states
  modals: {
    loginModal: false,
    registerModal: false,
    bookingModal: false,
    paymentModal: false,
    reviewModal: false,
    filterModal: false,
    cartModal: false,
    profileModal: false,
    settingsModal: false,
    deleteConfirmModal: false,
    imageGalleryModal: false,
    notificationModal: false,
  },
  
  // Sidebar states
  sidebars: {
    cartSidebar: false,
    filterSidebar: false,
    mobileMenu: false,
    userMenu: false,
  },
  
  // Loading states
  loading: {
    global: false,
    auth: false,
    services: false,
    bookings: false,
    payments: false,
    cart: false,
    profile: false,
  },
  
  // Notification states
  notifications: {
    show: false,
    type: 'info', // 'success', 'error', 'warning', 'info'
    message: '',
    duration: 5000,
  },
  
  // Theme and appearance
  theme: {
    mode: 'light', // 'light', 'dark'
    primaryColor: 'blue',
    fontSize: 'medium', // 'small', 'medium', 'large'
    compactMode: false,
  },
  
  // Search and filters
  search: {
    query: '',
    filters: {},
    sortBy: 'relevance',
    viewMode: 'grid', // 'grid', 'list'
  },
  
  // Pagination
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
  },
  
  // Form states
  forms: {
    bookingForm: {
      step: 1,
      isValid: false,
      errors: {},
    },
    paymentForm: {
      step: 1,
      isValid: false,
      errors: {},
    },
    profileForm: {
      isEditing: false,
      isValid: false,
      errors: {},
    },
  },
  
  // Toast notifications
  toasts: [],
  
  // Error states
  errors: {
    global: null,
    auth: null,
    services: null,
    bookings: null,
    payments: null,
    cart: null,
  },
  
  // Success states
  success: {
    global: false,
    auth: false,
    services: false,
    bookings: false,
    payments: false,
    cart: false,
  },
  
  // Messages
  messages: {
    global: '',
    auth: '',
    services: '',
    bookings: '',
    payments: '',
    cart: '',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Sidebar actions
    openSidebar: (state, action) => {
      const { sidebarName } = action.payload;
      if (state.sidebars.hasOwnProperty(sidebarName)) {
        state.sidebars[sidebarName] = true;
      }
    },
    
    closeSidebar: (state, action) => {
      const { sidebarName } = action.payload;
      if (state.sidebars.hasOwnProperty(sidebarName)) {
        state.sidebars[sidebarName] = false;
      }
    },
    
    closeAllSidebars: (state) => {
      Object.keys(state.sidebars).forEach(key => {
        state.sidebars[key] = false;
      });
    },
    
    // Loading actions
    setLoading: (state, action) => {
      const { type, isLoading } = action.payload;
      if (state.loading.hasOwnProperty(type)) {
        state.loading[type] = isLoading;
      }
    },
    
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Notification actions
    showNotification: (state, action) => {
      const { type, message, duration } = action.payload;
      state.notifications = {
        show: true,
        type: type || 'info',
        message,
        duration: duration || 5000,
      };
    },
    
    hideNotification: (state) => {
      state.notifications.show = false;
    },
    
    // Toast actions
    addToast: (state, action) => {
      const toast = {
        id: Date.now(),
        ...action.payload,
      };
      state.toasts.push(toast);
    },
    
    removeToast: (state, action) => {
      const { id } = action.payload;
      state.toasts = state.toasts.filter(toast => toast.id !== id);
    },
    
    clearToasts: (state) => {
      state.toasts = [];
    },
    
    // Theme actions
    setTheme: (state, action) => {
      const { mode, primaryColor, fontSize, compactMode } = action.payload;
      if (mode) state.theme.mode = mode;
      if (primaryColor) state.theme.primaryColor = primaryColor;
      if (fontSize) state.theme.fontSize = fontSize;
      if (compactMode !== undefined) state.theme.compactMode = compactMode;
    },
    
    toggleTheme: (state) => {
      state.theme.mode = state.theme.mode === 'light' ? 'dark' : 'light';
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    
    setSearchFilters: (state, action) => {
      state.search.filters = { ...state.search.filters, ...action.payload };
    },
    
    clearSearchFilters: (state) => {
      state.search.filters = {};
    },
    
    setSortBy: (state, action) => {
      state.search.sortBy = action.payload;
    },
    
    setViewMode: (state, action) => {
      state.search.viewMode = action.payload;
    },
    
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
    },
    
    setTotalItems: (state, action) => {
      state.pagination.totalItems = action.payload;
    },
    
    // Form actions
    setFormStep: (state, action) => {
      const { formName, step } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].step = step;
      }
    },
    
    setFormValid: (state, action) => {
      const { formName, isValid } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].isValid = isValid;
      }
    },
    
    setFormErrors: (state, action) => {
      const { formName, errors } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].errors = errors;
      }
    },
    
    clearFormErrors: (state, action) => {
      const { formName } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].errors = {};
      }
    },
    
    setFormEditing: (state, action) => {
      const { formName, isEditing } = action.payload;
      if (state.forms.hasOwnProperty(formName)) {
        state.forms[formName].isEditing = isEditing;
      }
    },
    
    // Error actions
    setError: (state, action) => {
      const { type, error } = action.payload;
      if (state.errors.hasOwnProperty(type)) {
        state.errors[type] = error;
      }
    },
    
    clearError: (state, action) => {
      const { type } = action.payload;
      if (state.errors.hasOwnProperty(type)) {
        state.errors[type] = null;
      }
    },
    
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Success actions
    setSuccess: (state, action) => {
      const { type, success } = action.payload;
      if (state.success.hasOwnProperty(type)) {
        state.success[type] = success;
      }
    },
    
    clearSuccess: (state, action) => {
      const { type } = action.payload;
      if (state.success.hasOwnProperty(type)) {
        state.success[type] = false;
      }
    },
    
    clearAllSuccess: (state) => {
      Object.keys(state.success).forEach(key => {
        state.success[key] = false;
      });
    },
    
    // Message actions
    setMessage: (state, action) => {
      const { type, message } = action.payload;
      if (state.messages.hasOwnProperty(type)) {
        state.messages[type] = message;
      }
    },
    
    clearMessage: (state, action) => {
      const { type } = action.payload;
      if (state.messages.hasOwnProperty(type)) {
        state.messages[type] = '';
      }
    },
    
    clearAllMessages: (state) => {
      Object.keys(state.messages).forEach(key => {
        state.messages[key] = '';
      });
    },
    
    // Reset actions
    resetUI: (state) => {
      return initialState;
    },
    
    resetModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    resetSidebars: (state) => {
      Object.keys(state.sidebars).forEach(key => {
        state.sidebars[key] = false;
      });
    },
    
    resetLoading: (state) => {
      Object.keys(state.loading).forEach(key => {
        state.loading[key] = false;
      });
    },
    
    resetErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    resetSuccess: (state) => {
      Object.keys(state.success).forEach(key => {
        state.success[key] = false;
      });
    },
    
    resetMessages: (state) => {
      Object.keys(state.messages).forEach(key => {
        state.messages[key] = '';
      });
    },
  },
});

export const {
  // Modal actions
  openModal,
  closeModal,
  closeAllModals,
  
  // Sidebar actions
  openSidebar,
  closeSidebar,
  closeAllSidebars,
  
  // Loading actions
  setLoading,
  setGlobalLoading,
  
  // Notification actions
  showNotification,
  hideNotification,
  
  // Toast actions
  addToast,
  removeToast,
  clearToasts,
  
  // Theme actions
  setTheme,
  toggleTheme,
  
  // Search actions
  setSearchQuery,
  setSearchFilters,
  clearSearchFilters,
  setSortBy,
  setViewMode,
  
  // Pagination actions
  setCurrentPage,
  setItemsPerPage,
  setTotalItems,
  
  // Form actions
  setFormStep,
  setFormValid,
  setFormErrors,
  clearFormErrors,
  setFormEditing,
  
  // Error actions
  setError,
  clearError,
  clearAllErrors,
  
  // Success actions
  setSuccess,
  clearSuccess,
  clearAllSuccess,
  
  // Message actions
  setMessage,
  clearMessage,
  clearAllMessages,
  
  // Reset actions
  resetUI,
  resetModals,
  resetSidebars,
  resetLoading,
  resetErrors,
  resetSuccess,
  resetMessages,
} = uiSlice.actions;

// Selectors
export const selectModals = (state) => state.ui.modals;
export const selectSidebars = (state) => state.ui.sidebars;
export const selectLoading = (state) => state.ui.loading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectToasts = (state) => state.ui.toasts;
export const selectTheme = (state) => state.ui.theme;
export const selectSearch = (state) => state.ui.search;
export const selectPagination = (state) => state.ui.pagination;
export const selectForms = (state) => state.ui.forms;
export const selectErrors = (state) => state.ui.errors;
export const selectSuccess = (state) => state.ui.success;
export const selectMessages = (state) => state.ui.messages;

export default uiSlice.reducer;
