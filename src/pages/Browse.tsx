
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, X, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SwipeCard from '../components/SwipeCard';
import Modal from '../components/Modal';
import { getRecommendations } from '../utils/api';

export default function Browse() {
  const { state, dispatch, addToCart, canSwipeRight } = useApp();
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (state.recommendations.length === 0) {
      navigate('/');
    }
  }, [state.recommendations.length, navigate]);

  const handleSwipeRight = async () => {
    if (!canSwipeRight()) {
      setShowLimitModal(true);
      return;
    }

    const currentProduct = state.recommendations[state.currentIndex];
    if (currentProduct) {
      addToCart(currentProduct);
      await handleNextCard();

      if (state.swipeCount + 1 >= 10) {
        setShowLimitModal(true);
      }
    }
  };

  const handleSwipeLeft = async () => {
    await handleNextCard();
  };

  const handleNextCard = async () => {
    const nextIndex = state.currentIndex + 1;
    
    if (nextIndex >= state.recommendations.length) {
      // Fetch more recommendations using the last liked product as query
      const lastLikedProduct = state.cart[state.cart.length - 1];
      const newQuery = lastLikedProduct ? `${lastLikedProduct.brand} ${lastLikedProduct.name}` : state.query;
      
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newRecommendations = await getRecommendations(newQuery);
        dispatch({ type: 'SET_RECOMMENDATIONS', payload: newRecommendations });
      } catch (error) {
        console.error('Failed to fetch more recommendations:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_CURRENT_INDEX', payload: nextIndex });
    }
  };

  const currentProduct = state.recommendations[state.currentIndex];

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading more products...</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">No more products to show</h2>
          <button
            onClick={() => navigate('/cart')}
            className="bg-app-accent text-white px-6 py-3 rounded-2xl"
          >
            View Cart ({state.cart.length})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <div className="text-white">
          <span className="text-sm">{state.swipeCount}/10 swipes used</span>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="bg-app-accent text-white p-3 rounded-full relative"
        >
          <ShoppingCart size={20} />
          {state.cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {state.cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Card Stack */}
      <div className="absolute inset-0 p-4 pt-20 pb-32">
        <div className="relative w-full h-full max-w-sm mx-auto">
          {/* Show next card behind current card */}
          {state.recommendations[state.currentIndex + 1] && (
            <div className="absolute inset-0 bg-app-card rounded-2xl shadow-lg opacity-30 scale-95 transform translate-y-2" />
          )}
          
          <SwipeCard
            product={currentProduct}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            canSwipeRight={canSwipeRight()}
            isActive={true}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-center space-x-8 max-w-sm mx-auto">
          <motion.button
            onClick={handleSwipeLeft}
            className="bg-red-500 text-white p-4 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>

          <motion.button
            onClick={handleSwipeRight}
            disabled={!canSwipeRight()}
            className="bg-green-500 text-white p-4 rounded-full shadow-lg disabled:opacity-50 disabled:bg-gray-500"
            whileHover={{ scale: canSwipeRight() ? 1.1 : 1 }}
            whileTap={{ scale: canSwipeRight() ? 0.9 : 1 }}
          >
            <Heart size={24} />
          </motion.button>
        </div>
      </div>

      {/* Limit Reached Modal */}
      <Modal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        title="Swipe Limit Reached"
      >
        <div className="space-y-4">
          <p>You've reached the maximum of 10 swipes per session!</p>
          <p>Check out your cart or start a new session to continue browsing.</p>
          <div className="flex space-x-2 pt-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex-1 bg-app-accent text-white py-2 px-4 rounded-lg"
            >
              View Cart
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'RESET_SESSION' });
                navigate('/');
              }}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg"
            >
              New Session
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
