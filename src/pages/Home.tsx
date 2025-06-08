import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Heart, ShoppingBag } from 'lucide-react';
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
      // Add a small delay for smoother UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const recommendations = await getRecommendations(searchQuery);
      dispatch({ type: 'SET_QUERY', payload: searchQuery });
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      
      // Add another small delay before navigation for smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#333333] via-[#2a2a2a] to-[#1f1f1f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-[#28262B]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-[#A9A29C]/10 to-transparent blur-3xl" />
      </div>

      <motion.div
        className="text-center max-w-lg w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Icon Section */}
        <motion.div
          className="flex justify-center mb-8"
          variants={iconVariants}
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#28262B] to-[#A9A29C] rounded-2xl flex items-center justify-center shadow-2xl">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-[#A9A29C]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
          variants={itemVariants}
        >
          Fashion
          <motion.span 
            className="text-transparent bg-gradient-to-r from-[#A9A29C] to-[#D5CCC7] bg-clip-text ml-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Swipe
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-[#A9A29C] text-xl mb-12 leading-relaxed max-w-md mx-auto"
          variants={itemVariants}
        >
          Discover your next favorite fashion piece with our{' '}
          <span className="text-white font-medium">Tinder-style</span> browsing
        </motion.p>

        {/* Search Section */}
        <motion.div
          className="space-y-6"
          variants={itemVariants}
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: state.isLoading ? 1 : 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#28262B] to-[#A9A29C] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <input
              type="text"
              placeholder="What are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="relative w-full px-6 py-4 pr-14 rounded-3xl bg-[#D5CCC7]/90 backdrop-blur-sm text-[#28262B] placeholder-[#A9A29C] focus:outline-none focus:ring-2 focus:ring-[#28262B] focus:bg-[#D5CCC7] transition-all duration-300 text-lg font-medium shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={state.isLoading}
            />
            <motion.div
              className="absolute right-5 top-1/2 transform -translate-y-1/2"
              whileHover={{ scale: state.isLoading ? 1 : 1.1 }}
              whileTap={{ scale: state.isLoading ? 1 : 0.9 }}
            >
              {state.isLoading ? (
                <motion.div
                  className="w-6 h-6 border-2 border-[#A9A29C]/30 border-t-[#A9A29C] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Search className="text-[#A9A29C] w-6 h-6" />
              )}
            </motion.div>
          </motion.div>

          <motion.button
            onClick={handleStartBrowsing}
            disabled={!searchQuery.trim() || state.isLoading}
            className="w-full bg-gradient-to-r from-[#28262B] to-[#1a1a1a] text-white py-4 px-8 rounded-3xl font-semibold text-lg hover:from-[#2a2828] hover:to-[#1c1c1c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden"
            whileHover={{ 
              scale: searchQuery.trim() && !state.isLoading ? 1.02 : 1,
              boxShadow: "0 20px 40px rgba(40, 38, 43, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            {state.isLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#2a2828] to-[#1c1c1c]"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {state.isLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.span
                  key="loading-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Finding Products...
                </motion.span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <motion.span
                  key="start-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Start Browsing
                </motion.span>
              </>
            )}
          </motion.button>

          {state.error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-400 text-sm font-medium">{state.error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Features Preview */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-4 max-w-xs mx-auto"
          variants={itemVariants}
        >
          {[
            { icon: Heart, label: "Swipe Right" },
            { icon: Search, label: "AI Matching" },
            { icon: ShoppingBag, label: "Easy Cart" }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-[#D5CCC7]/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <feature.icon className="w-5 h-5 text-[#A9A29C]" />
              </div>
              <p className="text-[#A9A29C] text-xs font-medium">{feature.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
