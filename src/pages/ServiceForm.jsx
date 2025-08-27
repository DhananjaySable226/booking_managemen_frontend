import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  PlusIcon,
  PhotoIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { createService, updateService, getServiceById } from '../features/services/servicesSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ServiceForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, service } = useSelector((state) => state.services);
  const { user } = useSelector((state) => state.auth);

  const [images, setImages] = useState([]);
  const [availability, setAvailability] = useState({
    monday: { open: '09:00', close: '17:00', isOpen: true },
    tuesday: { open: '09:00', close: '17:00', isOpen: true },
    wednesday: { open: '09:00', close: '17:00', isOpen: true },
    thursday: { open: '09:00', close: '17:00', isOpen: true },
    friday: { open: '09:00', close: '17:00', isOpen: true },
    saturday: { open: '09:00', close: '17:00', isOpen: false },
    sunday: { open: '09:00', close: '17:00', isOpen: false }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const categories = [
    { id: 'hotel', name: 'Hotels & Accommodation' },
    { id: 'doctor', name: 'Healthcare & Doctors' },
    { id: 'vehicle', name: 'Vehicle Rental' },
    { id: 'transport', name: 'Transport & Tours' },
    { id: 'equipment', name: 'Equipment Rental' },
    { id: 'other', name: 'Other Services' }
  ];

  const priceTypes = [
    { id: 'fixed', name: 'Fixed Price' },
    { id: 'hourly', name: 'Per Hour' },
    { id: 'daily', name: 'Per Day' },
    { id: 'weekly', name: 'Per Week' },
    { id: 'monthly', name: 'Per Month' }
  ];

  const cancellationPolicies = [
    { id: 'flexible', name: 'Flexible - Free cancellation up to 24h before' },
    { id: 'moderate', name: 'Moderate - 50% refund up to 24h before' },
    { id: 'strict', name: 'Strict - No refunds within 48h' },
    { id: 'no_refund', name: 'No Refund' }
  ];

  useEffect(() => {
    if (isEditing && id) {
      dispatch(getServiceById(id));
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && service) {
      // Populate form with existing service data
      setValue('name', service.name);
      setValue('description', service.description);
      setValue('category', service.category);
      setValue('subcategory', service.subcategory);
      setValue('price.amount', service.price?.amount);
      setValue('price.currency', service.price?.currency || 'USD');
      setValue('price.type', service.price?.type || 'fixed');
      setValue('location.address', service.location?.address);
      setValue('location.city', service.location?.city);
      setValue('location.state', service.location?.state);
      setValue('location.zipCode', service.location?.zipCode);
      setValue('location.country', service.location?.country);
      setValue('cancellationPolicy', service.cancellationPolicy || 'moderate');
      setValue('cancellationHours', service.cancellationHours || 24);
      
      if (service.availability?.schedule) {
        setAvailability(service.availability.schedule);
      }
      
      if (service.images) {
        setImages(service.images);
      }
    }
  }, [service, isEditing, setValue]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      public_id: `temp_${Date.now()}_${Math.random()}`,
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleDayAvailability = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const updateDayTime = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const onSubmit = async (data) => {
    try {
      const serviceData = {
        ...data,
        availability: {
          schedule: availability,
          maxBookingsPerSlot: 1
        },
        features: [],
        amenities: [],
        tags: []
      };

      if (isEditing) {
        await dispatch(updateService({ id, serviceData })).unwrap();
        toast.success('Service updated successfully');
      } else {
        await dispatch(createService(serviceData)).unwrap();
        toast.success('Service created successfully');
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Failed to save service');
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Service' : 'Create New Service'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Update your service information' : 'Add a new service to your portfolio'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  {...register('name', { 
                    required: 'Service name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' }
                  })}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter service name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { 
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                  })}
                  rows={4}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your service in detail"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price.amount', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors['price.amount'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors['price.amount'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['price.amount'].message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  {...register('price.currency')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  {...register('price.type')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {priceTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  {...register('location.address', { required: 'Address is required' })}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors['location.address'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full address"
                />
                {errors['location.address'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['location.address'].message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  {...register('location.city', { required: 'City is required' })}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors['location.city'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                />
                {errors['location.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['location.city'].message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  {...register('location.state', { required: 'State is required' })}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors['location.state'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter state"
                />
                {errors['location.state'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['location.state'].message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  {...register('location.zipCode')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter ZIP code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  {...register('location.country', { required: 'Country is required' })}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors['location.country'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter country"
                />
                {errors['location.country'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['location.country'].message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability</h2>
            
            <div className="space-y-4">
              {Object.entries(availability).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.isOpen}
                        onChange={() => toggleDayAvailability(day)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                        {day}
                      </span>
                    </label>
                  </div>
                  
                  {schedule.isOpen && (
                    <>
                      <input
                        type="time"
                        value={schedule.open}
                        onChange={(e) => updateDayTime(day, 'open', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={schedule.close}
                        onChange={(e) => updateDayTime(day, 'close', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Service image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cancellation Policy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Type
                </label>
                <select
                  {...register('cancellationPolicy')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {cancellationPolicies.map(policy => (
                    <option key={policy.id} value={policy.id}>
                      {policy.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Hours
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('cancellationHours', { min: 0 })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="24"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                isEditing ? 'Update Service' : 'Create Service'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
