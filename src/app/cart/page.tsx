//src/app/cart/page.tsx
"use client"

import { useEffect, useState } from "react";
import { Product } from "@/interfaces/Product";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/services/orders.service";
import { FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

const Cart = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const {dataUser} = useAuth();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || "[]");
    if(storedCart){
      let totalCartPrice = 0;
      storedCart.forEach((product:Product) => {
        totalCartPrice = totalCartPrice + product.price;
      });
      setTotal(totalCartPrice);
      setCart(storedCart);
    }
  }, []);

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cart.filter(product => product.id !== Number(productId));
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Recalcular total
    const newTotal = updatedCart.reduce((sum, product) => sum + product.price, 0);
    setTotal(newTotal);
  };

  const handleCheckout = async() => {
    if(cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    
    try {
      const idProducts = cart.map((product) => product.id);
      await createOrder(idProducts, dataUser?.token!);
      alert("¡Compra exitosa!");
      setCart([]);
      setTotal(0);
      localStorage.removeItem('cart');
    } catch (error) {
      alert("Ocurrió un error al procesar tu compra");
      console.error(error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center text-[var(--color-morado)] hover:text-[var(--color-rosa)] transition-colors">
            <FaArrowLeft className="mr-2" />
            Continuar comprando
          </Link>
          <h1 className="text-3xl font-bold text-[var(--color-morado)] flex items-center">
            <FaShoppingCart className="mr-3" />
            Mi Carrito
          </h1>
          <div className="w-24"></div> {/* Spacer para alinear */}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FiShoppingBag className="mx-auto text-5xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-6">Agrega algunos productos para comenzar</p>
            <Link 
              href="/" 
              className="px-6 py-3 rounded-full bg-[var(--color-morado)] text-white hover:bg-[var(--color-rosa)] transition-colors duration-300 inline-flex items-center shadow-lg hover:shadow-[var(--color-rosa)/40]"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cart.map((product) => (
                    <div key={product.id} className="p-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={120}
                          height={120}
                          className="object-cover rounded-lg h-30 w-30 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                          <button 
                            onClick={() => handleRemoveItem(String(product.id))}
                            className="text-gray-400 hover:text-[var(--color-rosa)] transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        <p className="mt-2 text-gray-600">{product.description?.substring(0, 100)}...</p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-lg font-bold text-[var(--color-morado)]">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Cantidad:</span>
                            <span className="font-medium">1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Resumen de compra */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumen de compra</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">{formatPrice(0)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-xl font-bold text-[var(--color-morado)]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 px-6 py-3 rounded-full bg-[var(--color-morado)] text-white hover:bg-[var(--color-rosa)] transition-colors duration-300 flex items-center justify-center shadow-lg hover:shadow-[var(--color-rosa)/40]"
                  >
                    <FiShoppingBag className="mr-2" />
                    Proceder al pago
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    o{' '}
                    <Link href="/" className="text-[var(--color-morado)] hover:underline">
                      continuar comprando
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;