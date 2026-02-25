import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Package } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import NavHeader from "@/components/NavHeader"
import OrderCard from "@/components/OrderCard"

export default function OrderHistory() {
    const { user, loading: authLoading } = useAuth()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login")
        }
    }, [user, authLoading, navigate])

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error("Error fetching orders:", error)
            } else {
                setOrders(data || [])
            }
            setLoading(false)
        }

        if (user) {
            fetchOrders()
        }
    }, [user])

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#fdf2f8] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fdf2f8]">
            <NavHeader />

            <main className="container mx-auto px-6 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/" className="text-rose-600 hover:text-rose-800 flex items-center gap-2 font-medium mb-4">
                            <ArrowLeft size={20} />
                            Back to Store
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-rose-950">
                            Order History
                        </h1>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-rose-100">
                        <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                            <Package size={48} className="text-rose-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-rose-900 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-rose-600/70 mb-8 max-w-sm text-center">
                            When you place an order, it will appear here. Start shopping to find your next favorite item!
                        </p>
                        <Link to="/" className="inline-block bg-rose-600 pb-1 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl transition-all">
                            Browse Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
