import { Link } from "react-router-dom"
import { ArrowLeft, CreditCard } from "lucide-react"
import NavHeader from "@/components/NavHeader"
import CartItem from "@/components/CartItem"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"

export default function CartPage() {
    const { cartItems, getCartTotal, clearCart } = useCart()
    const total = getCartTotal().toLocaleString('vi-VN')

    return (
        <div className="min-h-screen bg-[#fdf2f8]">
            {/* Header */}
            <NavHeader />

            <main className="container mx-auto px-6 py-12">
                <div className="mb-8 flex items-center gap-4">
                    <Link to="/" className="text-rose-600 hover:text-rose-800 flex items-center gap-2 font-medium">
                        <ArrowLeft size={20} />
                        Continue Shopping
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-rose-950 ml-auto">
                        Your Shopping Bag
                    </h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-rose-100">
                        <div className="w-40 h-40 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                            <CreditCard size={64} className="text-rose-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-rose-900 mb-2">
                            Your bag is empty
                        </h2>
                        <p className="text-rose-600/70 mb-8 max-w-md text-center">
                            Looks like you haven't found anything yet.
                            We have lots of beautiful items waiting for you!
                        </p>
                        <Link to="/">
                            <Button className="rounded-full bg-rose-600 hover:bg-rose-700 h-12 px-8">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="h-fit bg-white p-8 rounded-3xl shadow-sm border border-rose-100 sticky top-24">
                            <h2 className="text-xl font-bold text-rose-950 mb-6 border-b border-rose-100 pb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-rose-900">{total}.000 ₫</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="border-t border-dashed border-rose-200 my-4" />
                                <div className="flex justify-between text-lg font-bold text-rose-950">
                                    <span>Total</span>
                                    <span>{total}.000 ₫</span>
                                </div>
                            </div>

                            <Button className="w-full rounded-full bg-rose-900 hover:bg-rose-800 h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                                Checkout
                            </Button>

                            <button
                                onClick={clearCart}
                                className="w-full mt-4 text-xs text-rose-400 hover:text-rose-600 underline"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
