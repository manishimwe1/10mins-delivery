import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrder = mutation({
  args: {
    // customerId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      price: v.number(),
    })),
    deliveryAddress: v.object({
      street: v.string(),
      city: v.string(),
      zipCode: v.string(),
      coordinates: v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    // Find nearest fulfillment hub
    // const hubs = await ctx.db.query("fulfillment_hubs")
    //   .filter(q => q.eq(q.field("isActive"), true))
    //   .collect();
    
    // // Simple distance calculation (in real app, use proper geolocation)
    // const nearestHub = hubs.reduce((closest, hub) => {
    //   const distance = Math.sqrt(
    //     Math.pow(hub.coordinates.lat - args.deliveryAddress.coordinates.lat, 2) +
    //     Math.pow(hub.coordinates.lng - args.deliveryAddress.coordinates.lng, 2)
    //   );
    //   return !closest || distance < closest.distance 
    //     ? { hub, distance } 
    //     : closest;
    // }, null as { hub: any, distance: number } | null);

    // if (!nearestHub) {
    //   throw new Error("No fulfillment hub available in your area");
    // }

    const totalAmount = args.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const estimatedDeliveryTime = Date.now() + (10 * 60 * 1000); // 10 minutes from now

    const orderId = await ctx.db.insert("orders", {
      // customerId: args.customerId,
      items: args.items,
      totalAmount,
      deliveryAddress: args.deliveryAddress,
      status: "pending",
      // hubId: nearestHub.hub._id,
      estimatedDeliveryTime,
    });

    return orderId;
  },
});

export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const getOrdersByCustomer = query({
  args: { customerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("orders")
      // .withIndex("by_customer", q => q.eq("customerId", args.customerId))
      .order("desc")
      .collect();
  },
});

export const getActiveOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders")
      .withIndex("by_status")
      .filter(q => q.neq(q.field("status"), "delivered"))
      .filter(q => q.neq(q.field("status"), "cancelled"))
      .collect();
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready_for_pickup"),
      v.literal("picked_up"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    deliveryPartnerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const updateData: any = { status: args.status };
    
    if (args.deliveryPartnerId) {
      updateData.deliveryPartnerId = args.deliveryPartnerId;
    }
    
    if (args.status === "delivered") {
      updateData.actualDeliveryTime = Date.now();
    }

    await ctx.db.patch(args.orderId, updateData);
  },
});

export const getOrdersForDelivery = query({
  args: { deliveryPartnerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("orders")
      .withIndex("by_delivery_partner", q => q.eq("deliveryPartnerId", args.deliveryPartnerId))
      .filter(q => q.neq(q.field("status"), "delivered"))
      .filter(q => q.neq(q.field("status"), "cancelled"))
      .collect();
  },
});
