import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    // Create fulfillment hub
    const hubId = await ctx.db.insert("fulfillment_hubs", {
      name: "Downtown Hub",
      address: "123 Main St, New York, NY 10001",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      radius: 5,
      isActive: true,
    });

    // Create sample products
    const products = [
      {
        name: "Fresh Bananas",
        description: "Organic bananas, perfect for smoothies",
        price: 2.99,
        category: "fruits",
        isActive: true,
      },
      {
        name: "Whole Milk",
        description: "Fresh whole milk, 1 gallon",
        price: 4.49,
        category: "dairy",
        isActive: true,
      },
      {
        name: "Sourdough Bread",
        description: "Artisan sourdough bread, freshly baked",
        price: 5.99,
        category: "bakery",
        isActive: true,
      },
      {
        name: "Organic Eggs",
        description: "Free-range organic eggs, dozen",
        price: 6.99,
        category: "dairy",
        isActive: true,
      },
      {
        name: "Avocados",
        description: "Ripe Hass avocados, pack of 4",
        price: 7.99,
        category: "fruits",
        isActive: true,
      },
      {
        name: "Greek Yogurt",
        description: "Plain Greek yogurt, 32oz container",
        price: 5.49,
        category: "dairy",
        isActive: true,
      },
      {
        name: "Baby Spinach",
        description: "Fresh baby spinach leaves, 5oz bag",
        price: 3.99,
        category: "vegetables",
        isActive: true,
      },
      {
        name: "Cherry Tomatoes",
        description: "Sweet cherry tomatoes, 1lb container",
        price: 4.99,
        category: "vegetables",
        isActive: true,
      },
      {
        name: "Chicken Breast",
        description: "Boneless skinless chicken breast, 1lb",
        price: 8.99,
        category: "meat",
        isActive: true,
      },
      {
        name: "Pasta",
        description: "Whole wheat penne pasta, 1lb box",
        price: 2.49,
        category: "pantry",
        isActive: true,
      },
    ];

    const productIds = [];
    for (const product of products) {
      const productId = await ctx.db.insert("products", product);
      productIds.push(productId);
      
      // Add inventory for each product
      await ctx.db.insert("inventory", {
        productId,
        hubId,
        quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
        reservedQuantity: 0,
      });
    }

    // Create a sample customer
    await ctx.db.insert("users", {
      email: "customer@example.com",
      name: "John Doe",
      phone: "+1234567890",
      role: "customer",
      address: {
        street: "456 Oak Ave",
        city: "New York",
        zipCode: "10002",
        coordinates: { lat: 40.7200, lng: -74.0100 },
      },
      isActive: true,
    });

    // Create a sample delivery partner
    await ctx.db.insert("users", {
      email: "driver@example.com",
      name: "Jane Smith",
      phone: "+1987654321",
      role: "delivery_partner",
      isActive: true,
    });

    return { message: "Seed data created successfully!", productCount: products.length };
  },
});
