import { useState, useEffect } from 'react'
import { getAdminStats, getAllProducts, getAllOrders } from '../services/adminApi'
import { LoadingSpinner, EmptyState } from '../components/Common'
import AdminLayout from '../components/AdminLayout'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        getAdminStats(),
        getAllProducts(),
        getAllOrders(),
      ])

      setStats(statsRes.data.stats)
      setProducts(productsRes.data.products || [])
      setOrders(ordersRes.data.orders || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    )
  }

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Processing').length
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length

  const cards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: '📦', color: 'blue' },
    { title: 'Active Products', value: stats?.activeProducts || 0, icon: '✓', color: 'green' },
    { title: 'Total Orders', value: orders.length, icon: '🛒', color: 'purple' },
    { title: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'yellow' },
    { title: 'Delivered Orders', value: deliveredOrders, icon: '✓', color: 'green' },
    { title: 'Low Stock Items', value: stats?.lowStockProducts || 0, icon: '⚠️', color: 'red' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                card.color === 'blue'
                  ? 'border-blue-500'
                  : card.color === 'green'
                  ? 'border-green-500'
                  : card.color === 'purple'
                  ? 'border-purple-500'
                  : card.color === 'yellow'
                  ? 'border-yellow-500'
                  : 'border-red-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <span className="text-4xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <EmptyState message="No orders yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{order._id.substring(0, 8)}</td>
                      <td className="py-3 px-4 text-sm">{order.user?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm font-semibold">₹{order.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.orderStatus === 'Processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
