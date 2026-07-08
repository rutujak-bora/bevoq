import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const STORAGE = "bevoq_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(items)); }, [items]);

  const add = (product, { quantity = 1, size = null, color = null } = {}) => {
    setItems(prev => {
      const key = `${product.id}::${size || ""}::${color || ""}`;
      const idx = prev.findIndex(i => i.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, {
        key,
        product_id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        quantity, size, color,
      }];
    });
    toast.success(`${product.title} added to cart`);
  };

  const update = (key, quantity) => {
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i));
  };

  const remove = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const clear = () => setItems([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, update, remove, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}
