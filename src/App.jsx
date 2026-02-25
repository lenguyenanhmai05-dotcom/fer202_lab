import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import CartPage from "@/pages/CartPage"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"
import OrderHistory from "@/pages/OrderHistory"

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
