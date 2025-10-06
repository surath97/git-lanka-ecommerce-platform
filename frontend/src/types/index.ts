export interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  contact: string;
  role: 'admin' | 'user';
  is_active: boolean;
  privileges?: UserPrivilege;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  fname: string;
  lname: string;
  email: string;
  contact: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  brand: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  cost_price: number;
  sell_price: number;
  description: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface UserPrivilege {
  id: number;
  user_id: number;
  can_add_product: boolean;
  can_update_product: boolean;
  can_delete_product: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_products: number;
  active_products: number;
  total_customers: number;
  active_customers: number;
  total_users: number;
  active_users: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}