// src/app/page.tsx
import { fetchProducts } from "@/services/productsFetcher.service";
import Card from "@/components/Card";

export default async function Home() {
  const productsPreload = await fetchProducts();

  return (
    <main className="min-h-screen bg-[var(--color-crema)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[var(--color-morado)] to-[var(--color-rosa)] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
            Welcome to The Dexter Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover exclusive products with the best quality in the market
          </p>
          <button className="bg-white text-[var(--color-morado)] hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Explore Collection
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 max-w-full mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-morado)] mb-4 font-serif">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Carefully selected items just for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productsPreload.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[var(--color-morado)] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 font-serif">Join Our Community</h2>
          <p className="text-xl mb-8">Subscribe to receive exclusive offers and updates</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rosa)] focus:border transition-all duration-200"
            />
            <button className="bg-[var(--color-rosa)] hover:bg-white hover:text-[var(--color-morado)] px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white max-w-full mx-auto">
        <h2 className="text-3xl font-bold text-center text-[var(--color-morado)] mb-12 font-serif">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { quote: "The quality exceeded my expectations!", author: "María G.", role: "Premium Client" },
            { quote: "Fast delivery and excellent customer service.", author: "Carlos P.", role: "Frequent Buyer" },
            { quote: "Beautiful products that last over time.", author: "Ana L.", role: "Interior Designer" },
          ].map((t, i) => (
            <div key={i} className="bg-[var(--color-crema)] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-[var(--color-morado)] text-4xl mb-4">&quot;</div> {/* ✅ escapado */}
              <p className="text-gray-700 mb-4">{t.quote}</p>
              <div className="text-[var(--color-rosa)] font-medium">{t.author}</div>
              <div className="text-gray-500 text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
