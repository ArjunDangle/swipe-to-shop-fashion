
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  name: string;
  brand: string;
  price: number;
  currency: string;
  description: string;
  url: string;
  image: string;
  id?: string;
}

interface AppState {
  query: string;
  recommendations: Product[];
  currentIndex: number;
  cart: Product[];
  swipeCount: number;
  sessionId: string;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_RECOMMENDATIONS'; payload: Product[] }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'INCREMENT_SWIPE_COUNT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_SESSION' };

const initialState: AppState = {
  query: '',
  recommendations: [],
  currentIndex: 0,
  cart: [],
  swipeCount: 0,
  sessionId: uuidv4(),
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload, currentIndex: 0 };
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload };
    case 'ADD_TO_CART':
      const productWithId = { ...action.payload, id: uuidv4() };
      return { ...state, cart: [...state.cart, productWithId] };
    case 'REMOVE_FROM_CART':
      return { 
        ...state, 
        cart: state.cart.filter(item => item.id !== action.payload) 
      };
    case 'INCREMENT_SWIPE_COUNT':
      return { ...state, swipeCount: state.swipeCount + 1 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_SESSION':
      return { ...initialState, sessionId: uuidv4() };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  canSwipeRight: () => boolean;
  getTotalPrice: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (product: Product) => {
    if (state.swipeCount < 10) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
      dispatch({ type: 'INCREMENT_SWIPE_COUNT' });
    }
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const canSwipeRight = () => state.swipeCount < 10;

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => total + item.price, 0);
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    canSwipeRight,
    getTotalPrice,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
