-- Dealio v2 API Integration Migration
-- Adds Dealio reference columns to existing Supabase tables

-- 1. cart_items: add variant_id (Dealio variant CUID) and product_name snapshot
ALTER TABLE cart_items
  ADD COLUMN IF NOT EXISTS variant_id TEXT,
  ADD COLUMN IF NOT EXISTS product_name TEXT;

-- 2. orders: add Dealio order reference columns
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS dealio_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS dealio_order_number TEXT;

-- 3. customer_profiles: add Dealio customer reference
ALTER TABLE customer_profiles
  ADD COLUMN IF NOT EXISTS dealio_customer_id TEXT;

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_orders_dealio_transaction_id ON orders(dealio_transaction_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_dealio_customer_id ON customer_profiles(dealio_customer_id);
