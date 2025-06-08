
import axios from 'axios';
import { Product } from '../context/AppContext';

const API_BASE_URL = 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getRecommendations(query: string): Promise<Product[]> {
  try {
    const response = await api.post('/recommend', { query });
    
    // Process the response to ensure proper image URLs
    return response.data.map((product: Product) => ({
      ...product,
      image: product.image.startsWith('http') 
        ? product.image 
        : `${API_BASE_URL}${product.image}`
    }));
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch recommendations');
  }
}
