
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ThankYou() {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleStartNewSession = () => {
    dispatch({ type: 'RESET_SESSION' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <motion.div
        className="text-center max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <CheckCircle size={48} className="text-white" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Thank You!
        </motion.h1>

        <motion.p
          className="text-app-text text-lg mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Your order has been confirmed!
        </motion.p>

        <motion.p
          className="text-app-text mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          We'll send you an email confirmation shortly with tracking details.
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.button
            onClick={handleStartNewSession}
            className="w-full bg-app-accent text-white py-3 px-6 rounded-2xl font-medium hover:bg-opacity-90 transition-all flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={20} className="mr-2" />
            Start New Session
          </motion.button>

          <motion.p
            className="text-app-text text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Continue shopping for more amazing fashion finds!
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
