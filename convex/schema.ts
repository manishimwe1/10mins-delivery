import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("delivery_partner"), v.literal("admin")),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      zipCode: v.string(),
      coordinates: v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    })),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    image_url: v.array(v.string()),
    stock_quantity: v.number(),
    isActive:v.optional(v.boolean())
  }).index("by_category",["category"]),

  inventory: defineTable({
    productId: v.id("products"),
    hubId: v.id("fulfillment_hubs"),
    quantity: v.number(),
    reservedQuantity: v.number(),
  }).index("by_product_hub", ["productId", "hubId"]),

  fulfillment_hubs: defineTable({
    name: v.string(),
    address: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    radius: v.number(), // delivery radius in km
    isActive: v.boolean(),
  }),

  orders: defineTable({
    // customerId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      price: v.number(),
    })),
    totalAmount: v.number(),
    deliveryAddress: v.object({
      street: v.string(),
      city: v.string(),
      zipCode: v.string(),
      coordinates: v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    }),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready_for_pickup"),
      v.literal("picked_up"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    // hubId: v.id("fulfillment_hubs"),
    deliveryPartnerId: v.optional(v.id("users")),
    estimatedDeliveryTime: v.number(),
    actualDeliveryTime: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
  // .index("by_customer", ["customerId"])
    .index("by_status", ["status"])
    .index("by_delivery_partner", ["deliveryPartnerId"]),

  delivery_tracking: defineTable({
    orderId: v.id("orders"),
    deliveryPartnerId: v.id("users"),
    currentLocation: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    timestamp: v.number(),
    status: v.string(),
  }).index("by_order", ["orderId"]),
});
