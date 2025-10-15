export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
      <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded" />
      <h3 className="heading-font text-base text-[var(--color-primary)] mt-3">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <div className="mt-3 w-full flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-semibold">₹{product.price}</div>
          <div className="text-xs text-gray-400 line-through">₹{Math.round(product.price * 1.2)}</div>
        </div>
        <button className="bg-[var(--color-primary)] text-white px-3 py-1 rounded text-sm hover:bg-[var(--color-secondary)]">BUY</button>
      </div>
    </div>
  )
}
