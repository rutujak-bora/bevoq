import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import CollectionPage from "@/pages/CollectionPage";
import About from "@/pages/About";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Wishlist from "@/pages/Wishlist";
import Orders from "@/pages/Orders";
import Account from "@/pages/Account";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";

import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import { AdminProducts, AdminProductForm } from "@/pages/admin/AdminProducts";
import AdminCollections from "@/pages/admin/AdminCollections";
import { AdminOrders, AdminOrderDetail } from "@/pages/admin/AdminOrders";
import { AdminCustomers, AdminPayments } from "@/pages/admin/AdminCustomersPayments";

function StoreRoute({ children }) {
  return <StorefrontLayout>{children}</StorefrontLayout>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-right" richColors />
            <Routes>
              {/* Storefront */}
              <Route path="/" element={<StoreRoute><Home /></StoreRoute>} />
              <Route path="/products" element={<StoreRoute><Products /></StoreRoute>} />
              <Route path="/products/:slug" element={<StoreRoute><ProductDetail /></StoreRoute>} />
              <Route path="/collections/:slug" element={<StoreRoute><CollectionPage /></StoreRoute>} />
              <Route path="/trending" element={<StoreRoute><Products mode="trending" /></StoreRoute>} />
              <Route path="/best-selling" element={<StoreRoute><Products mode="best-selling" /></StoreRoute>} />
              <Route path="/about" element={<StoreRoute><About /></StoreRoute>} />
              <Route path="/cart" element={<StoreRoute><Cart /></StoreRoute>} />
              <Route path="/checkout" element={<StoreRoute><Checkout /></StoreRoute>} />
              <Route path="/order-confirmation/:id" element={<StoreRoute><OrderConfirmation /></StoreRoute>} />
              <Route path="/wishlist" element={<StoreRoute><Wishlist /></StoreRoute>} />
              <Route path="/orders" element={<ProtectedRoute><StoreRoute><Orders /></StoreRoute></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><StoreRoute><Account /></StoreRoute></ProtectedRoute>} />
              <Route path="/login" element={<StoreRoute><Login /></StoreRoute>} />
              <Route path="/register" element={<StoreRoute><Register /></StoreRoute>} />
              <Route path="/forgot-password" element={<StoreRoute><ForgotPassword /></StoreRoute>} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/products/new" element={<ProtectedRoute adminOnly><AdminProductForm /></ProtectedRoute>} />
              <Route path="/admin/products/:id/edit" element={<ProtectedRoute adminOnly><AdminProductForm /></ProtectedRoute>} />
              <Route path="/admin/collections" element={<ProtectedRoute adminOnly><AdminCollections /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/orders/:id" element={<ProtectedRoute adminOnly><AdminOrderDetail /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
