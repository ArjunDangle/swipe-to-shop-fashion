
import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Product } from '../context/AppContext';
import { formatPrice, truncateText } from '../utils/helpers';
import { ExternalLink, Heart, X } from 'lucide-react';

interface SwipeCardProps {
  product: Product;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  canSwipeRight: boolean;
  isActive: boolean;
}

export default function SwipeCard({ 
  product, 
  onSwipeLeft, 
  onSwipeRight, 
  canSwipeRight,
  isActive 
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      // Right swipe
      if (canSwipeRight) {
        onSwipeRight();
      }
    } else if (offset < -100 || velocity < -500) {
      // Left swipe
      onSwipeLeft();
    }
  };

  const swipeRightIndicator = useTransform(x, [0, 100], [0, 1]);
  const swipeLeftIndicator = useTransform(x, [-100, 0], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex: isActive ? 10 : 1,
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="w-full h-full bg-app-card rounded-2xl shadow-lg overflow-hidden">
        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-4 left-4 z-20 bg-green-500 text-white px-3 py-2 rounded-full flex items-center gap-2"
          style={{ opacity: swipeRightIndicator }}
        >
          <Heart size={20} />
          <span className="font-medium">LIKE</span>
        </motion.div>

        <motion.div
          className="absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-2 rounded-full flex items-center gap-2"
          style={{ opacity: swipeLeftIndicator }}
        >
          <X size={20} />
          <span className="font-medium">PASS</span>
        </motion.div>

        {/* Product Image */}
        <div className="relative h-2/3 bg-gray-200">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Product Details */}
        <div className="p-4 h-1/3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-app-accent mb-1">{product.name}</h3>
            <p className="text-app-text text-sm mb-2">{product.brand}</p>
            <p className="text-app-text text-sm mb-3">
              {truncateText(product.description)}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-app-accent">
              {formatPrice(product.price, product.currency)}
            </span>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-app-text hover:text-app-accent transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
