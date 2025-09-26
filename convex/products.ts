import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products")
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("products")
      .filter(q => q.eq(q.field("category"), args.category))
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      isActive: true,
    });
  },
});

export const getInventoryByHub = query({
  args: { hubId: v.id("fulfillment_hubs") },
  handler: async (ctx, args) => {
    const inventory = await ctx.db.query("inventory")
      .withIndex("by_product_hub")
      .filter(q => q.eq(q.field("hubId"), args.hubId))
      .collect();

    // Join with product data
    const inventoryWithProducts = await Promise.all(
      inventory.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return inventoryWithProducts;
  },
});

export const updateInventory = mutation({
  args: {
    productId: v.id("products"),
    hubId: v.id("fulfillment_hubs"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("inventory")
      .withIndex("by_product_hub", q => 
        q.eq("productId", args.productId).eq("hubId", args.hubId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { quantity: args.quantity });
    } else {
      await ctx.db.insert("inventory", {
        productId: args.productId,
        hubId: args.hubId,
        quantity: args.quantity,
        reservedQuantity: 0,
      });
    }
  },
});
