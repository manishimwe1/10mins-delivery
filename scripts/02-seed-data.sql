-- Insert sample admin user
INSERT INTO users (email, password_hash, full_name, phone, user_type) VALUES
('admin@quickdelivery.com', '$2b$10$example_hash', 'Admin User', '+1234567890', 'admin');

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES
('Fresh Bananas', 'Organic bananas from local farms', 2.99, 'Fruits', '/placeholder.svg?height=200&width=200', 50),
('Whole Milk', 'Fresh whole milk 1L', 3.49, 'Dairy', '/placeholder.svg?height=200&width=200', 30),
('Bread Loaf', 'Freshly baked white bread', 2.79, 'Bakery', '/placeholder.svg?height=200&width=200', 25),
('Chicken Breast', 'Fresh chicken breast 1kg', 8.99, 'Meat', '/placeholder.svg?height=200&width=200', 20),
('Tomatoes', 'Fresh red tomatoes 500g', 3.99, 'Vegetables', '/placeholder.svg?height=200&width=200', 40),
('Orange Juice', 'Fresh orange juice 1L', 4.99, 'Beverages', '/placeholder.svg?height=200&width=200', 35),
('Pasta', 'Italian spaghetti pasta 500g', 1.99, 'Pantry', '/placeholder.svg?height=200&width=200', 60),
('Greek Yogurt', 'Creamy Greek yogurt 500g', 4.49, 'Dairy', '/placeholder.svg?height=200&width=200', 25);

-- Insert sample riders
INSERT INTO users (email, password_hash, full_name, phone, user_type) VALUES
('rider1@quickdelivery.com', '$2b$10$example_hash', 'John Rider', '+1234567891', 'rider'),
('rider2@quickdelivery.com', '$2b$10$example_hash', 'Sarah Delivery', '+1234567892', 'rider');

-- Insert rider details
INSERT INTO riders (user_id, vehicle_type, license_plate, is_available) VALUES
(2, 'Motorcycle', 'ABC-123', true),
(3, 'Bicycle', 'XYZ-789', true);

-- Insert sample customer
INSERT INTO users (email, password_hash, full_name, phone, user_type) VALUES
('customer@example.com', '$2b$10$example_hash', 'Jane Customer', '+1234567893', 'customer');
