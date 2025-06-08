
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRecommendations } from '../utils/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleStartBrowsing = async () => {
    if (!searchQuery.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const recommendations = await getRecommendations(searchQuery);
      dispatch({ type: 'SET_QUERY', payload: searchQuery });
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      navigate('/browse');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch recommendations. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartBrowsing();
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-center max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Fashion
          <span className="text-app-text"> Swipe</span>
        </motion.h1>

        <motion.p
          className="text-app-text text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Discover your next favorite fashion piece with our Tinder-style browsing
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 pr-12 rounded-2xl bg-app-card text-app-accent placeholder-app-text focus:outline-none focus:ring-2 focus:ring-app-accent"
              disabled={state.isLoading}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-app-text" size={20} />
          </div>

          <motion.button
            onClick={handleStartBrowsing}
            disabled={!searchQuery.trim() || state.isLoading}
            className="w-full bg-app-accent text-white py-3 px-6 rounded-2xl font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: searchQuery.trim() && !state.isLoading ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
          >
            {state.isLoading ? 'Loading...' : 'Start Browsing'}
          </motion.button>

          {state.error && (
            <motion.p
              className="text-red-400 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {state.error}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
