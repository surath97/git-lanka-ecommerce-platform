import { create } from 'zustand';
import { User, Customer } from '@/types';

interface AuthState {
  user: User | null;
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  userType: 'admin' | 'customer' | null;
  setAuth: (user: User | Customer, token: string, userType: 'admin' | 'customer') => void;
  logout: () => void;
  updateUser: (user: User | Customer) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  customer: null,
  token: null,
  isAuthenticated: false,
  userType: null,
  setAuth: (user, token, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem(userType === 'admin' ? 'user' : 'customer', JSON.stringify(user));
    
    set({
      [userType === 'admin' ? 'user' : 'customer']: user,
      token,
      isAuthenticated: true,
      userType,
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('customer');
    localStorage.removeItem('userType');
    
    set({
      user: null,
      customer: null,
      token: null,
      isAuthenticated: false,
      userType: null,
    });
  },
  updateUser: (user) => {
    set((state) => {
      if (state.userType === 'admin') {
        localStorage.setItem('user', JSON.stringify(user));
        return { user: user as User };
      } else {
        localStorage.setItem('customer', JSON.stringify(user));
        return { customer: user as Customer };
      }
    });
  },
}));