import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { getServices, searchServices, getServicesByCategory } from '../features/services/servicesSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.services);

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'hotel', name: 'Hotels & Accommodation' },
    { id: 'doctor', name: 'Healthcare & Doctors' },
    { id: 'vehicle', name: 'Vehicle Rental' },
    { id: 'transport', name: 'Transport & Tours' },
    { id: 'equipment', name: 'Equipment Rental' },
    { id: 'other', name: 'Other Services' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
  ];

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    console.log('Services from Redux:', services);
  }, [services]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchServices({ query: searchTerm, category: selectedCategory }));
    } else {
      dispatch(getServices());
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      dispatch(getServicesByCategory(categoryId));
    } else {
      dispatch(getServices());
    }
  };

  const handleSort = (sortValue) => {
    setSortBy(sortValue);
    // Implement sorting logic here
  };

  const filteredAndSortedServices = (services || [])
    .filter(service => {
      const servicePrice = service.price?.amount || 0;
      const matchesPrice = servicePrice >= priceRange[0] && servicePrice <= priceRange[1];
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      return matchesPrice && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.price?.amount || 0) - (b.price?.amount || 0);
        case 'price-high':
          return (b.price?.amount || 0) - (a.price?.amount || 0);
        case 'rating':
          return (b.rating?.average || 0) - (a.rating?.average || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < Math.floor(rating) ? (
          <StarIconSolid className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon className="h-4 w-4 text-gray-300" />
        )}
      </span>
    ));
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={service.images?.[0]?.url || '/placeholder-service.jpg'}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
        {service.isFeatured && (
          <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
          <StarIcon className="h-4 w-4 text-yellow-400" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {service.name}
          </h3>
          <div className="flex items-center ml-2">
            {renderStars(service.rating?.average || 0)}
            <span className="ml-1 text-sm text-gray-600">({service.reviews?.length || 0})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{service.location?.city}, {service.location?.state}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-lg font-bold text-green-600">
              ${service.price?.amount || 0}
            </span>
            <span className="text-sm text-gray-500 ml-1">/{service.price?.type || 'booking'}</span>
          </div>

          <Link
            to={`/services/${service._id}`}
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Service
          </h1>
          <p className="text-gray-600">
            Discover and book amazing services from trusted providers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden"
                >
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className={`space-y-6 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Search</h3>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search services..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </form>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={() => handleCategoryChange(category.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedServices.length} services found
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Services */}
            {filteredAndSortedServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {filteredAndSortedServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
