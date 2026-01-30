import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, User, LogIn, LogOut, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

export default function NavHeader() {
    const { getCartCount } = useCart()
    // Lazy init to avoid useEffect and satisfy linter
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("currentUser")
            return stored ? JSON.parse(stored) : null
        }
        return null
    })

    const handleLogout = () => {
        localStorage.removeItem("currentUser")
        setUser(null)
        alert("Logged out successfully!")
        // Optional: Redirect to login or stay. Lab 2 said stay.
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 bg-gradient-to-tr from-rose-400 to-pink-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-pink-600">
                            Luxe Collection
                        </span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    {/* CART ICON */}
                    <Link to="/cart">
                        <Button variant="ghost" className="relative group text-rose-900 hover:text-rose-700 hover:bg-rose-50">
                            <ShoppingCart className="h-6 w-6" />
                            {getCartCount() > 0 && (
                                <span className="absolute top-0 right-0 h-5 w-5 bg-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    {getCartCount()}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* AUTH BUTTONS */}
                    {user ? (
                        <>
                            <span className="hidden md:inline-block text-rose-900 font-medium font-serif">
                                Welcome, {user.name}
                            </span>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="text-rose-900 hover:text-rose-700 hover:bg-rose-50 font-medium"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-rose-900 hover:text-rose-700 hover:bg-rose-50 font-medium">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white rounded-full px-6 shadow-md transition-all hover:shadow-lg">
                                    <User className="mr-2 h-4 w-4" />
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
