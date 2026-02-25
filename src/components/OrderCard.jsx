import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OrderCard({ order }) {
    const formattedDate = new Date(order.created_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        processing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        shipped: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        delivered: "bg-green-100 text-green-800 hover:bg-green-200",
        cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
    }

    const badgeColor = statusColors[order.status] || "bg-gray-100 text-gray-800 hover:bg-gray-200"

    return (
        <Card className="rounded-3xl border-rose-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-rose-50/50 pb-4 border-b border-rose-100 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-sm font-medium text-rose-500 mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                    <p className="text-xs text-slate-500">{formattedDate}</p>
                </div>
                <Badge className={`${badgeColor} uppercase tracking-wider text-[10px] font-bold pb-1 pt-1`}>
                    {order.status}
                </Badge>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-semibold text-rose-900">
                                {(parseInt(item.price.replace(/[^\d]/g, ""), 10) * item.quantity).toLocaleString('vi-VN')} ₫
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Total Amount</span>
                <span className="text-lg font-bold text-rose-950">{order.total_price.toLocaleString('vi-VN')} ₫</span>
            </CardFooter>
        </Card>
    )
}
