import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ShoppingCart, Star } from "lucide-react"

export default function ProductCard({ product }) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        addToCart(product, quantity)
        setQuantity(1) // Reset local quantity
        alert(`Added ${quantity} x ${product.name} to cart!`)
    }

    // Helper to render stars
    const renderStars = (rating) => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <Star
                    key={i}
                    size={14}
                    className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                        }`}
                />
            ))
    }

    return (
        <Card key={product.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl bg-white h-full flex flex-col">
            <div className="aspect-[3/4] w-full overflow-hidden bg-rose-50 relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-600 shadow-sm">
                    {product.price}
                </div>
            </div>

            <CardHeader className="pt-6">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 truncate mr-2">
                        {product.name}
                    </CardTitle>
                    <div className="flex gap-0.5 mt-1">
                        {renderStars(product.rating)}
                    </div>
                </div>
                <CardDescription className="line-clamp-2 text-gray-500 font-light text-sm">
                    {product.description}
                </CardDescription>
            </CardHeader>

            <CardFooter className="mt-auto flex gap-3 items-center pb-6 px-6">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-full px-2 py-1 bg-gray-50 h-10">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 text-gray-500 hover:text-rose-600 font-bold"
                    >-</button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 text-gray-500 hover:text-rose-600 font-bold"
                    >+</button>
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white h-10 shadow-md group-active:scale-95 transition-all"
                >
                    <ShoppingCart size={16} className="mr-2" />
                    Add
                </Button>
            </CardFooter>
        </Card>
    )
}
