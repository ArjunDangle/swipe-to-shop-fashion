
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const { state, removeFromCart, getTotalPrice } = useApp();
  const navigate = useNavigate();

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-app-bg">
        <div className="p-4">
          <button
            onClick={() => navigate('/browse')}
            className="flex items-center text-white mb-6"
          >
            <ArrowLeft size={24} className="mr-2" />
            Back to Browsing
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-32 h-32 bg-app-card rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-app-text" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-app-text mb-6">
            Start swiping to add products to your cart!
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-app-accent text-white px-6 py-3 rounded-2xl"
          >
            Go back to browsing
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
            onClick={() => navigate('/browse')}
            className="flex items-center text-white"
          >
            <ArrowLeft size={24} className="mr-2" />
            Back
          </button>
          <h1 className="text-white text-xl font-bold">
            Cart ({state.cart.length})
          </h1>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 pb-32">
        <div className="space-y-4">
          {state.cart.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-app-card rounded-2xl p-4 flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-app-accent">{item.name}</h3>
                <p className="text-app-text text-sm">{item.brand}</p>
                <p className="font-bold text-app-accent">
                  {formatPrice(item.price, item.currency)}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id!)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-app-card p-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-app-accent font-semibold">Total:</span>
          <span className="text-app-accent text-xl font-bold">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-app-accent text-white py-3 px-6 rounded-2xl font-medium hover:bg-opacity-90 transition-all"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
