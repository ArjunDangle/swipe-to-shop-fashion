
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/helpers';

export default function Checkout() {
  const { state, getTotalPrice, dispatch } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'credit-card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/thank-you');
    }, 2000);
  };

  const isFormValid = formData.name && formData.email && formData.address;

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">No items in cart</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-app-accent text-white px-6 py-3 rounded-2xl"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-white"
          >
            <ArrowLeft size={24} className="mr-2" />
            Back to Cart
          </button>
          <h1 className="text-white text-xl font-bold">Checkout</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <motion.div
            className="bg-app-card rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-app-accent font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {state.cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-app-text">{item.name}</span>
                  <span className="text-app-accent">
                    {formatPrice(item.price, item.currency)}
                  </span>
                </div>
              ))}
              <div className="border-t border-app-text pt-2 mt-4">
                <div className="flex justify-between font-bold text-app-accent">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          <motion.div
            className="bg-app-card rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-app-accent font-bold mb-4">Customer Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-app-text text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-app-accent placeholder-app-text focus:outline-none focus:ring-2 focus:ring-app-accent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-app-text text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-app-accent placeholder-app-text focus:outline-none focus:ring-2 focus:ring-app-accent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-app-text text-sm mb-2">Shipping Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-app-accent placeholder-app-text focus:outline-none focus:ring-2 focus:ring-app-accent resize-none"
                  placeholder="Enter your complete address"
                  required
                />
              </div>

              <div>
                <label className="block text-app-text text-sm mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent"
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="apple-pay">Apple Pay</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-app-accent text-white py-4 px-6 rounded-2xl font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <CreditCard size={20} className="mr-2" />
                Confirm Purchase
              </div>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
