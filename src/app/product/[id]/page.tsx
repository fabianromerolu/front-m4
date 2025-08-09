// src/app/product/[id]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchProductById } from "@/services/productsFetcher.service";
import { Product } from "@/interfaces/Product";
import { useAuth } from "@/context/AuthContext";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

type ToastType = "success" | "warning" | "error" | "info";

export default function ProductPageId() {
  const { dataUser } = useAuth();

  const params = useParams();
  const productId = useMemo(() => {
    const id = params?.id;
    return Array.isArray(id) ? id[0] : (id as string | undefined);
  }, [params]);

  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Toast state
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const showToast = (type: ToastType, message: string, ms = 2800) => {
    setToast({ type, message });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), ms);
  };

  useEffect(() => {
    async function fetchData() {
      if (!productId) return;
      try {
        const product = await fetchProductById(productId);
        setProductData(product);
      } catch (error) {
        console.error("Error al traer el producto:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  const handleAddCart = () => {
    if (!productData) return;

    if (!dataUser?.token) {
      showToast("info", "Debes iniciar sesión para añadir al carrito.");
      return;
    }

    try {
      const cart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cart.some((p) => p.id === productData.id);

      if (exists) {
        showToast("warning", "Este producto ya está en tu carrito.");
        return;
      }

      cart.push(productData);
      localStorage.setItem("cart", JSON.stringify(cart));
      // notifica a la navbar para actualizar el contador
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      showToast("success", "Producto agregado al carrito.");
    } catch (e) {
      console.error(e);
      showToast("error", "No se pudo agregar al carrito. Intenta de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-crema)] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-4 z-[60] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={[
              "relative flex items-start gap-3 rounded-xl p-4 shadow-lg backdrop-blur-md",
              "border",
              toast.type === "success" && "bg-green-50/95 border-green-200 text-green-800",
              toast.type === "warning" && "bg-amber-50/95 border-amber-200 text-amber-800",
              toast.type === "error" && "bg-rose-50/95 border-rose-200 text-rose-800",
              toast.type === "info" && "bg-white/95 border-[var(--color-morado)]/20 text-[var(--color-morado)]",
            ].filter(Boolean).join(" ")}
            role="status"
            aria-live="polite"
          >
            <div className="mt-0.5">
              {toast.type === "success" && <FiCheckCircle className="h-5 w-5" />}
              {toast.type === "warning" && <FiAlertTriangle className="h-5 w-5" />}
              {toast.type === "error" && <FiAlertTriangle className="h-5 w-5" />}
              {toast.type === "info" && <FiInfo className="h-5 w-5" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="rounded-md p-1 hover:bg-black/5 transition-colors"
              aria-label="Cerrar notificación"
            >
              <FiX />
            </button>
            {/* Barra de progreso */}
            <span
              className={[
                "pointer-events-none absolute left-0 bottom-0 h-0.5",
                toast.type === "success" && "bg-green-600/70",
                toast.type === "warning" && "bg-amber-600/70",
                toast.type === "error" && "bg-rose-600/70",
                toast.type === "info" && "bg-[var(--color-morado)]/70",
              ].join(" ")}
              style={{ width: "100%", animation: "shrink 2.6s linear forwards" }}
            />
            <style jsx>{`
              @keyframes shrink {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-morado)]"></div>
        </div>
      ) : productData ? (
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-[var(--color-morado)] hover:text-[var(--color-rosa)]"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 mx-1 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {productData.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Product Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <Image
                  src={productData.image}
                  alt={productData.name}
                  width={800}
                  height={800}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-[var(--color-morado)] font-serif mb-4">
                {productData.name}
              </h1>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">(24 reviews)</span>
              </div>

              <p className="text-3xl font-bold text-[var(--color-morado)] mb-6">
                ${productData.price.toFixed(2)}
              </p>

              <p className="text-gray-700 mb-8 leading-relaxed">{productData.description}</p>

              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      productData.stock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {productData.stock > 0
                      ? `Disponible (${productData.stock} unidades)`
                      : "Agotado"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* (Opcional) selector de cantidad visual — no altera tu estructura del carrito */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button className="px-4 py-2 bg-gray-100 text-[var(--color-morado)] hover:bg-gray-200">-</button>
                  <span className="px-4 py-2">1</span>
                  <button className="px-4 py-2 bg-gray-100 text-[var(--color-morado)] hover:bg-gray-200">+</button>
                </div>

                <button
                  className="flex-1 bg-[var(--color-morado)] hover:bg-[var(--color-rosa)] text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                  onClick={handleAddCart}
                  disabled={productData.stock <= 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {productData.stock > 0 ? "Añadir al carrito" : "Agotado"}
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-[var(--color-morado)] mb-4">Detalles del producto</h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="text-gray-600 w-32">Categoría</span>
                    <span className="text-gray-800">Electrónicos</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 w-32">SKU</span>
                    <span className="text-gray-800">DS-{productData.id}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 w-32">Envío</span>
                    <span className="text-gray-800">Entrega en 2-3 días</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-[var(--color-morado)] mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">
            Lo sentimos, no pudimos encontrar el producto que buscas.
          </p>
          <Link
            href="/"
            className="inline-block bg-[var(--color-morado)] hover:bg-[var(--color-rosa)] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      )}
    </main>
  );
}
