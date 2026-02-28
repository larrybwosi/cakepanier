// ─── Dealio v2 API — Shared Types ───────────────────────────────────────────
// This file is SERVER-ONLY. Never import from client components.

export interface DealioTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds
  scope: string;
}

export interface DealioCategory {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DealioVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  totalStock: number;
  isAvailable: boolean;
  isLowStock: boolean;
  lowStockThreshold: number;
  attributes: Record<string, string>;
}

export interface DealioProduct {
  id: string;
  name: string;
  description: string;
  detailedDescription: string | null; // Markdown content
  sku: string;
  categoryId: string;
  category: DealioCategory | null;
  images: string[];
  variants: DealioVariant[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  lowStockThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DealioProductsResponse {
  products: DealioProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DealioInventoryItem {
  variantId: string;
  locationId: string;
  availableStock: number;
  reservedStock: number;
  totalStock: number;
  isLowStock: boolean;
  lowStockThreshold: number;
  isAvailable: boolean;
}

export interface DealioInventoryResponse {
  data: DealioInventoryItem[];
}

export interface DealioOrderItem {
  variantId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface DealioOrderCreatePayload {
  externalOrderId: string;
  locationId: string;
  customerId?: string;
  items: DealioOrderItem[];
  shippingTotal?: number;
  discountTotal?: number;
  notes?: string;
  channel: 'ECOMMERCE_STORE';
}

export interface DealioOrder {
  id: string;
  orderNumber: string;
  externalOrderId: string;
  status: string;
  channel: string;
  items: Array<{
    id: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface DealioCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  customerType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DealioCustomerCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  customerType: 'retail' | 'wholesale';
}

export interface DealioHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
}

export interface DealioErrorBody {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}
