import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart()

    // Parse price string to number for subtotal calculation
    const getPriceNumber = (priceString) => {
        return parseInt(priceString.replace(/[^\d]/g, ""), 10)
    }

    const priceNum = getPriceNumber(item.price)
    const subtotal = (priceNum * item.quantity).toLocaleString('vi-VN')

    return (
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-rose-100 hover:shadow-md transition-all">
            {/* Image */}
            <div className="w-full md:w-32 aspect-square rounded-2xl overflow-hidden bg-rose-50 flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
                <h3 className="text-xl font-serif font-bold text-rose-950">{item.name}</h3>
                <p className="text-rose-600 font-medium">{item.price}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-rose-50 rounded-full p-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-rose-600 hover:bg-white hover:text-rose-800"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                    <Minus size={16} />
                </Button>
                <span className="w-8 text-center font-bold text-rose-900">{item.quantity}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-rose-600 hover:bg-white hover:text-rose-800"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                    <Plus size={16} />
                </Button>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[120px]">
                <p className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-1">Subtotal</p>
                <p className="text-lg font-bold text-rose-900">{subtotal}.000 ₫</p>
            </div>

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                onClick={() => removeFromCart(item.id)}
            >
                <Trash2 size={20} />
            </Button>
        </div>
    )
}
