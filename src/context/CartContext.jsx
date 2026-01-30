import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
    // 1. Hook: useState - Local state for the cart
    // Lazy initialization for optimization (read from LS only once)
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("shopping-cart")
            return savedCart ? JSON.parse(savedCart) : []
        }
        return []
    })

    // 2. Hook: useEffect - Sync state to LocalStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem("shopping-cart", JSON.stringify(cartItems))
    }, [cartItems])

    // Function: Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id)
            if (existingItem) {
                // If item exists, update quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                // If new item, add to array
                return [...prevItems, { ...product, quantity }]
            }
        })
    }

    // Function: Remove item from cart
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
    }

    // Function: Update item quantity
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
            return
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        )
    }

    // Function: Clear cart (optional, good for testing/logout)
    const clearCart = () => {
        setCartItems([])
    }

    // Helper: Calculate Total Price
    // (Parsing the VND string like "550.000 ₫" back to number)
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            // Remove ' ₫' and '.' then parse
            const priceNumber = parseInt(item.price.replace(/[^\d]/g, ""), 10)
            return total + priceNumber * item.quantity
        }, 0)
    }

    // Helper: Calculate Total Items Count
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    return useContext(CartContext)
}
