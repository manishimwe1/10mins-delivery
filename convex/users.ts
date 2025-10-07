import { internalMutation, query, QueryCtx } from "./_generated/server";
import { v, Validator } from "convex/values";

// Define the UserJSON type to match Clerk's user data structure
type UserJSON = {
  id: string;
  first_name: string;
  last_name: string;
  email_addresses: Array<{ email_address: string; verification: { status: string } }>;
  image_url: string;
};

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const email = data.email_addresses[0]?.email_address || "";
    const emailVerified = data.email_addresses[0]?.verification?.status === "verified";
    
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      tokenIdentifier: data.id,
      email: email,
      emailVerified: emailVerified,
      pictureUrl: data.image_url || "",
      updatedAt: new Date().toISOString(),
      role: "customer", // Default role
      isActive: true,
    };

    const user = await userByTokenIdentifier(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByTokenIdentifier(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByTokenIdentifier(ctx, identity.subject);
}

async function userByTokenIdentifier(ctx: QueryCtx, tokenIdentifier: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
    .unique();
}