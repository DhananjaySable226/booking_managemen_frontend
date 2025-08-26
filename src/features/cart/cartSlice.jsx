import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItemIndex = state.items.findIndex(
                item => item.serviceId === newItem.serviceId
            );

            if (existingItemIndex >= 0) {
                // Update existing item
                state.items[existingItemIndex] = {
                    ...state.items[existingItemIndex],
                    ...newItem,
                };
            } else {
                // Add new item
                state.items.push(newItem);
            }

            // Recalculate totals
            state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            state.itemCount = state.items.length;
        },

        removeFromCart: (state, action) => {
            const serviceId = action.payload;
            state.items = state.items.filter(item => item.serviceId !== serviceId);

            // Recalculate totals
            state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            state.itemCount = state.items.length;
        },

        updateCartItem: (state, action) => {
            const { serviceId, updates } = action.payload;
            const itemIndex = state.items.findIndex(item => item.serviceId === serviceId);

            if (itemIndex >= 0) {
                state.items[itemIndex] = { ...state.items[itemIndex], ...updates };

                // Recalculate totals
                state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
        },

        setCartItems: (state, action) => {
            state.items = action.payload;
            state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            state.itemCount = state.items.length;
        },

        updateItemQuantity: (state, action) => {
            const { serviceId, quantity } = action.payload;
            const itemIndex = state.items.findIndex(item => item.serviceId === serviceId);

            if (itemIndex >= 0) {
                if (quantity <= 0) {
                    // Remove item if quantity is 0 or negative
                    state.items.splice(itemIndex, 1);
                } else {
                    // Update quantity
                    state.items[itemIndex].quantity = quantity;
                    state.items[itemIndex].price = state.items[itemIndex].basePrice * quantity;
                }

                // Recalculate totals
                state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
                state.itemCount = state.items.length;
            }
        },

        moveToWishlist: (state, action) => {
            const serviceId = action.payload;
            state.items = state.items.filter(item => item.serviceId !== serviceId);

            // Recalculate totals
            state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            state.itemCount = state.items.length;
        },

        applyDiscount: (state, action) => {
            const { code, discountAmount, discountType } = action.payload;

            if (discountType === 'percentage') {
                state.total = state.total * (1 - discountAmount / 100);
            } else if (discountType === 'fixed') {
                state.total = Math.max(0, state.total - discountAmount);
            }
        },

        removeDiscount: (state) => {
            // Recalculate totals without discount
            state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
        },

        updateShippingInfo: (state, action) => {
            const { address, method, cost } = action.payload;
            state.shipping = {
                address,
                method,
                cost: cost || 0,
            };

            // Recalculate total with shipping
            const subtotal = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            state.total = subtotal + (state.shipping?.cost || 0);
        },

        addServiceToCart: (state, action) => {
            const service = action.payload;
            const cartItem = {
                serviceId: service._id,
                serviceName: service.name,
                price: service.price,
                basePrice: service.price,
                image: service.images?.[0] || '/placeholder-service.jpg',
                provider: service.provider,
                category: service.category,
                quantity: 1,
                date: null,
                time: null,
                specialRequests: '',
                addedAt: new Date().toISOString(),
            };

            const existingItemIndex = state.items.findIndex(
                item => item.serviceId === cartItem.serviceId
            );

            if (existingItemIndex >= 0) {
                // Update existing item
                state.items[existingItemIndex] = {
                    ...state.items[existingItemIndex],
                    ...cartItem,
                };
            } else {
                // Add new item
                state.items.push(cartItem);
            }

            // Recalculate totals
            state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            state.itemCount = state.items.length;
        },

        updateCartItemDate: (state, action) => {
            const { serviceId, date } = action.payload;
            const itemIndex = state.items.findIndex(item => item.serviceId === serviceId);

            if (itemIndex >= 0) {
                state.items[itemIndex].date = date;
            }
        },

        updateCartItemTime: (state, action) => {
            const { serviceId, time } = action.payload;
            const itemIndex = state.items.findIndex(item => item.serviceId === serviceId);

            if (itemIndex >= 0) {
                state.items[itemIndex].time = time;
            }
        },

        updateCartItemRequests: (state, action) => {
            const { serviceId, specialRequests } = action.payload;
            const itemIndex = state.items.findIndex(item => item.serviceId === serviceId);

            if (itemIndex >= 0) {
                state.items[itemIndex].specialRequests = specialRequests;
            }
        },

        validateCartItems: (state, action) => {
            const { validItems, invalidItems } = action.payload;

            // Remove invalid items
            state.items = state.items.filter(item =>
                validItems.some(validItem => validItem.serviceId === item.serviceId)
            );

            // Recalculate totals
            state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
            state.itemCount = state.items.length;
        },

        setCartFromLocalStorage: (state, action) => {
            const savedCart = action.payload;
            if (savedCart && savedCart.items) {
                state.items = savedCart.items;
                state.total = savedCart.total || 0;
                state.itemCount = savedCart.itemCount || 0;
            }
        },

        syncCartWithServer: (state, action) => {
            const serverCart = action.payload;
            if (serverCart && serverCart.items) {
                state.items = serverCart.items;
                state.total = serverCart.total || 0;
                state.itemCount = serverCart.itemCount || 0;
            }
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    setCartItems,
    updateItemQuantity,
    moveToWishlist,
    applyDiscount,
    removeDiscount,
    updateShippingInfo,
    addServiceToCart,
    updateCartItemDate,
    updateCartItemTime,
    updateCartItemRequests,
    validateCartItems,
    setCartFromLocalStorage,
    syncCartWithServer,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartIsEmpty = (state) => state.cart.items.length === 0;
export const selectCartItemById = (state, serviceId) =>
    state.cart.items.find(item => item.serviceId === serviceId);

export default cartSlice.reducer;
