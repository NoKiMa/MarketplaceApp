/**
 * Represents a single order item in the system
 */
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

/**
 * Represents the shipping address for an order
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
}

/**
 * Represents the status of an order
 */
export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

/**
 * Represents a complete order in the system
 */
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

/**
 * Request payload for creating a new order
 */
export interface OrderRequest {
  userId: string;
  items: OrderItem[];
  shippingInfo: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
}

/**
 * Response when creating a new order
 */
export interface OrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

/**
 * Parameters for querying orders
 */
export interface OrderQueryParams {
  userId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response for order lists
 */
export interface PaginatedOrderResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Request payload for updating order status
 */
export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}