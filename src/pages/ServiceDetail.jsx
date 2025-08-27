import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
    MapPinIcon,
    StarIcon,
    CalendarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    PhoneIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    XCircleIcon,
    HeartIcon,
    ShareIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { addToCart } from '../features/cart/cartSlice';
import { useMemo } from 'react';
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../features/favorites/favoritesSlice';
import { getServiceById, addServiceReview } from '../features/services/servicesSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    const { service, loading, error } = useSelector((state) => state.services);
    const favorites = useSelector((state) => state.favorites.items);
    const { user } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        if (id) {
            dispatch(getServiceById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (user) {
            dispatch(fetchFavorites());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        const fav = favorites?.some(s => (s._id || s.id) === service?._id);
        setIsFavorite(!!fav);
    }, [favorites, service]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        const basePrice = typeof service?.price === 'number' ? service.price : (service?.price?.amount ?? 0);
        const cartItem = {
            serviceId: service?._id,
            serviceName: service?.name,
            price: basePrice,
            basePrice,
            image: (service?.images?.[0]?.url) || service?.images?.[0] || '/placeholder-service.jpg',
            provider: service?.provider || {},
            quantity: 1,
            date: selectedDate,
            time: selectedTime,
        };

        dispatch(addToCart(cartItem));
        toast.success('Added to cart successfully!');
    };

    const handleBookNow = () => {
        if (!user) {
            toast.error('Please login to book services');
            navigate('/login');
            return;
        }

        if (!selectedDate || !selectedTime) {
            toast.error('Please select date and time');
            return;
        }

        // Add item to cart and go to checkout
        const cartItem = {
            serviceId: service?._id,
            serviceName: service?.name,
            price: typeof service?.price === 'number' ? service.price : (service?.price?.amount ?? 0),
            image: service?.images?.[0] || '/placeholder-service.jpg',
            provider: service?.provider,
            date: selectedDate,
            time: selectedTime,
        };
        dispatch(addToCart(cartItem));
        navigate('/checkout');
    };

    const handleReviewSubmit = async (data) => {
        try {
            await dispatch(addServiceReview({ serviceId: service._id, reviewData: data })).unwrap();
            toast.success('Review submitted successfully!');
            reset();
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const renderStars = (rating) => {
        const normalized = typeof rating === 'number' ? rating : (rating?.average ?? 0);
        return [...Array(5)].map((_, index) => (
            <span key={index}>
                {index < Math.floor(normalized) ? (
                    <StarIconSolid className="h-5 w-5 text-yellow-400" />
                ) : (
                    <StarIcon className="h-5 w-5 text-gray-300" />
                )}
            </span>
        ));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(typeof price === 'number' ? price : (price?.amount ?? 0));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Service not found</h2>
                    <p className="text-gray-600">The service you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <a href="/" className="text-gray-700 hover:text-primary-600">
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <a href="/services" className="text-gray-700 hover:text-primary-600">
                                    Services
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-500">{service.name}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            <div className="relative">
                                <img
                                    src={(() => {
                                        const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
                                            ? import.meta.env.VITE_API_BASE_URL
                                            : 'http://localhost:5000';
                                        const val = service?.images?.[selectedImage];
                                        const url = typeof val === 'string' ? val : (val?.url || '');
                                        if (!url) return '/placeholder-service.jpg';
                                        if (url.startsWith('http://') || url.startsWith('https://')) return url;
                                        return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
                                    })()}
                                    alt={service.name}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={async () => {
                                            if (!user) { toast.error('Please login to save favorites'); return; }
                                            try {
                                                if (isFavorite) {
                                                    await dispatch(removeFromFavorites(service._id)).unwrap();
                                                    setIsFavorite(false);
                                                } else {
                                                    await dispatch(addToFavorites(service._id)).unwrap();
                                                    setIsFavorite(true);
                                                }
                                            } catch (e) {
                                                toast.error('Failed to update favorites');
                                            }
                                        }}
                                        className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        {isFavorite ? (
                                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <HeartIcon className="h-5 w-5 text-gray-600" />
                                        )}
                                    </button>
                                    <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                                        <ShareIcon className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Images */}
                            {Array.isArray(service?.images) && service.images.length > 1 && (
                                <div className="p-4 flex space-x-2 overflow-x-auto">
                                    {service.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={(() => {
                                                    const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
                                                        ? import.meta.env.VITE_API_BASE_URL
                                                        : 'http://localhost:5000';
                                                    const url = typeof image === 'string' ? image : (image?.url || '');
                                                    if (!url) return '/placeholder-service.jpg';
                                                    if (url.startsWith('http://') || url.startsWith('https://')) return url;
                                                    return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
                                                })()}
                                                alt={`${service.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Service Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{service?.name}</h1>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            {renderStars(service?.rating)}
                                            <span className="ml-2 text-sm text-gray-600">
                                                {(typeof service?.rating === 'number' ? service.rating : (service?.rating?.average ?? 0)).toFixed(1)} ({service?.reviews?.length || 0} reviews)
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPinIcon className="h-4 w-4 mr-1" />
                                            {service?.location?.city}, {service?.location?.state}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-600">
                                        {formatPrice(service?.price)}
                                    </div>
                                    <div className="text-sm text-gray-500">per booking</div>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">{service?.description}</p>

                            {/* Features */}
                            {Array.isArray(service?.features) && service.features.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {service.features.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Amenities */}
                            {Array.isArray(service?.amenities) && service.amenities.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {service.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                                <span className="text-sm text-gray-700">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Provider Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Provider</h3>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={service?.provider?.avatar || '/placeholder-avatar.jpg'}
                                        alt={service?.provider?.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{service?.provider?.name}</h4>
                                        <p className="text-sm text-gray-600">{service?.provider?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                                <button
                                    onClick={() => setShowReviews(!showReviews)}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                                </button>
                            </div>

                            {showReviews && (
                                <div className="space-y-4">
                                    {service.reviews && service.reviews.length > 0 ? (
                                        service.reviews.map((review, index) => (
                                            <div key={index} className="border-b pb-4 last:border-b-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={review.user?.avatar || '/placeholder-avatar.jpg'}
                                                            alt={review.user?.name}
                                                            className="w-8 h-8 rounded-full object-cover mr-3"
                                                        />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{review.user?.name}</h4>
                                                            <div className="flex items-center">
                                                                {renderStars(review.rating)}
                                                                <span className="ml-2 text-sm text-gray-500">
                                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No reviews yet</p>
                                    )}

                                    {/* Add Review Form */}
                                    {user && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-gray-900 mb-3">Write a Review</h4>
                                            <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Rating
                                                    </label>
                                                    <select
                                                        {...register('rating', { required: 'Rating is required' })}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                                    >
                                                        <option value="">Select rating</option>
                                                        <option value="5">5 stars - Excellent</option>
                                                        <option value="4">4 stars - Very Good</option>
                                                        <option value="3">3 stars - Good</option>
                                                        <option value="2">2 stars - Fair</option>
                                                        <option value="1">1 star - Poor</option>
                                                    </select>
                                                    {errors.rating && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Comment
                                                    </label>
                                                    <textarea
                                                        {...register('comment', { required: 'Comment is required' })}
                                                        rows="3"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                                        placeholder="Share your experience..."
                                                    />
                                                    {errors.comment && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                                                >
                                                    Submit Review
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Service</h3>

                            <div className="space-y-4">
                                {/* Date Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Time
                                    </label>
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select time</option>
                                        <option value="09:00">9:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">1:00 PM</option>
                                        <option value="14:00">2:00 PM</option>
                                        <option value="15:00">3:00 PM</option>
                                        <option value="16:00">4:00 PM</option>
                                        <option value="17:00">5:00 PM</option>
                                    </select>
                                </div>

                                {/* Price Summary */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Service Price</span>
                                        <span className="font-medium">{formatPrice(service?.price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Booking Fee</span>
                                        <span className="font-medium">{formatPrice(10)}</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="font-bold text-lg text-green-600">
                                                {formatPrice((typeof service?.price === 'number' ? service.price : (service?.price?.amount ?? 0)) + 10)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleBookNow}
                                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
                                    >
                                        Book Now
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Contact Information */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Contact Provider</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <PhoneIcon className="h-4 w-4 mr-2" />
                                            {service?.provider?.phone || 'N/A'}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <EnvelopeIcon className="h-4 w-4 mr-2" />
                                            {service?.provider?.email || 'N/A'}
                                        </div>
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

export default ServiceDetail;
