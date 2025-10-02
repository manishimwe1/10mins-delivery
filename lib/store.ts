import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Doc } from "@/convex/_generated/dataModel";

export interface CartItem extends Doc<"products"> {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Doc<"products">) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item._id === product._id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cart: [...state.cart, { ...product, quantity: 1 }],
            };
          }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== productId),
        })),
      increaseQuantity: (productId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decreaseQuantity: (productId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === productId
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage", // key in localStorage
    }
  )
);