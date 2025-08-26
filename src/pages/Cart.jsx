import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    TrashIcon,
    PlusIcon,
    MinusIcon,
    ShoppingBagIcon,
    ArrowLeftIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import {
    selectCartItems,
    selectCartTotal,
    selectCartItemCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateItemTotal,
    formatPrice
} from '../features/cart/cartSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Cart = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [removingItem, setRemovingItem] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const cartItemCount = useSelector(selectCartItemCount);

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setIsUpdating(true);
        try {
            dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
        } catch (error) {
            toast.error('Failed to update quantity');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setRemovingItem(itemId);
        try {
            dispatch(removeFromCart(itemId));
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setRemovingItem(null);
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            dispatch(clearCart());
            toast.success('Cart cleared');
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/services');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Looks like you haven't added any services to your cart yet.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={handleContinueShopping}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="mt-2 text-gray-600">
                        {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-6">
                                        <div className="flex items-center space-x-4">
                                            {/* Item Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={item.image || '/placeholder-service.jpg'}
                                                    alt={item.serviceName}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                                            {item.serviceName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Provider: {item.provider?.name || 'Unknown'}
                                                        </p>
                                                        {item.date && (
                                                            <p className="text-sm text-gray-500">
                                                                Date: {new Date(item.date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                        {item.time && (
                                                            <p className="text-sm text-gray-500">
                                                                Time: {item.time}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-green-600">
                                                            {formatPrice(calculateItemTotal(item))}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatPrice(item.price)} each
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                                            disabled={isUpdating || (item.quantity || 1) <= 1}
                                                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <MinusIcon className="h-4 w-4" />
                                                        </button>
                                                        <span className="text-sm font-medium text-gray-900 w-8 text-center">
                                                            {item.quantity || 1}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                                            disabled={isUpdating}
                                                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <PlusIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        disabled={removingItem === item.id}
                                                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {removingItem === item.id ? (
                                                            <LoadingSpinner size="small" />
                                                        ) : (
                                                            <TrashIcon className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Clear Cart Button */}
                            <div className="px-6 py-4 border-t border-gray-200">
                                <button
                                    onClick={handleClearCart}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-4">
                                {/* Items */}
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Items ({cartItemCount})</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>

                                {/* Booking Fee */}
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Booking Fee</span>
                                    <span>{formatPrice(10 * cartItemCount)}</span>
                                </div>

                                {/* Tax */}
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax</span>
                                    <span>{formatPrice(cartTotal * 0.08)}</span>
                                </div>

                                {/* Total */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatPrice(cartTotal + (10 * cartItemCount) + (cartTotal * 0.08))}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Including tax and booking fees
                                    </p>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isUpdating}
                                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isUpdating ? (
                                        <LoadingSpinner size="small" />
                                    ) : (
                                        <>
                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                            Proceed to Checkout
                                        </>
                                    )}
                                </button>

                                {/* Continue Shopping */}
                                <button
                                    onClick={handleContinueShopping}
                                    className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Continue Shopping
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-5 w-5 text-green-500">
                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="ml-2">Secure payment processing</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-5 w-5 text-green-500">
                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="ml-2">Free cancellation up to 24 hours before</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-5 w-5 text-green-500">
                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="ml-2">Instant booking confirmation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
