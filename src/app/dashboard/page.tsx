// src/app/dashboard/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { getAllOrders } from "@/services/orders.service";
import PATHROUTES from "@/utils/pathRoutes";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone, FaIdCard, FaShoppingCart } from "react-icons/fa";
import { FiLogOut, FiShoppingBag } from "react-icons/fi";

type OrderProduct = { id: number; name: string; price: number; image?: string; description?: string };
type Order = { id: number; date: string; status: "approved" | "pending" | "rejected" | string; products: OrderProduct[] };

const Dashboard = () => {
  const { dataUser, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [orders]
  );

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.replace(PATHROUTES.HOME);
  };

  useEffect(() => {
    if (!dataUser && !isLoggingOut) {
      router.replace(PATHROUTES.LOGIN);
    }
  }, [dataUser, isLoggingOut, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataUser?.token) return;
      try {
        setLoadingOrders(true);
        setErrorOrders(null);
        const ordersResponse = await getAllOrders(dataUser.token);
        setOrders(Array.isArray(ordersResponse) ? ordersResponse : []);
      } catch (err) {
        console.error("Error fetching orders", err);
        setErrorOrders("No se pudieron cargar tus órdenes. Intenta nuevamente.");
      } finally {
        setLoadingOrders(false);
      }
    };
    if (dataUser?.token) fetchData();
  }, [dataUser?.token]);

  if (!dataUser && !isLoggingOut) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--color-crema)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-morado)]" />
      </div>
    );
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(v);
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  const orderTotal = (o: Order) => o.products.reduce((s, p) => s + (p.price ?? 0), 0);
  const statusBadge = (s: string) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
    if (s === "approved") return `${base} bg-green-100 text-green-700`;
    if (s === "pending") return `${base} bg-amber-100 text-amber-700`;
    if (s === "rejected") return `${base} bg-rose-100 text-rose-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8 bg-gradient-to-r from-[var(--color-morado)] to-[var(--color-rosa)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">¡Bienvenido de vuelta, {dataUser?.user?.name}!</h2>
                <p className="text-white/90 mt-2">Aquí puedes administrar tu información personal y revisar tus órdenes.</p>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-morado)]"
              >
                <FiLogOut className="transition-transform group-hover:rotate-12" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Info */}
        {dataUser && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-[var(--color-morado)] bg-opacity-10 p-3 rounded-full mr-4">
                    <FaUser className="text-[var(--color-morado)] text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Información Personal</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-4">
                      <FaIdCard className="text-[var(--color-morado)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID de usuario</p>
                      <p className="font-medium">{dataUser.user.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-4">
                      <FaEnvelope className="text-[var(--color-morado)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Correo electrónico</p>
                      <p className="font-medium">{dataUser.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-[var(--color-morado)] bg-opacity-10 p-3 rounded-full mr-4">
                    <FaPhone className="text-[var(--color-morado)] text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Información de Contacto</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-4">
                      <FaPhone className="text-[var(--color-morado)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{dataUser.user.phone || "No proporcionado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-4">
                      <FaMapMarkerAlt className="text-[var(--color-morado)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium">{dataUser.user.address || "No proporcionada"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        <section>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaShoppingCart className="text-[var(--color-morado)]" />
                Mis órdenes
              </h3>
              {loadingOrders && <span className="text-sm text-gray-500">Cargando…</span>}
            </div>

            {errorOrders ? (
              <div className="p-6">
                <p className="text-rose-600">{errorOrders}</p>
                <button
                  onClick={() => location.reload()}
                  className="mt-3 px-4 py-2 rounded-full bg-[var(--color-morado)] text-white hover:bg-[var(--color-rosa)] transition"
                >
                  Reintentar
                </button>
              </div>
            ) : sortedOrders.length === 0 && !loadingOrders ? (
              <div className="p-8 text-center">
                <FiShoppingBag className="mx-auto text-5xl text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Aún no tienes órdenes</h4>
                <p className="text-gray-500 mb-6">Cuando compres, verás tus órdenes aquí.</p>
                <Link
                  href={PATHROUTES.HOME}
                  className="px-6 py-3 rounded-full bg-[var(--color-morado)] text-white hover:bg-[var(--color-rosa)] transition-colors duration-300 inline-flex items-center shadow-lg hover:shadow-[var(--color-rosa)/40]"
                >
                  Ir a comprar
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {sortedOrders.map((o) => {
                  const total = orderTotal(o);
                  const isOpen = !!expanded[o.id];
                  return (
                    <li key={o.id} className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Orden #{o.id} • {formatDate(o.date)}</p>
                          <div className="mt-1 flex items-center gap-3">
                            <span className={statusBadge(o.status)}>
                              {o.status === "approved" ? "Aprobada" : o.status === "pending" ? "Pendiente" : o.status === "rejected" ? "Rechazada" : o.status}
                            </span>
                            <span className="text-sm text-gray-600">
                              {o.products.length} {o.products.length === 1 ? "producto" : "productos"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-[var(--color-morado)]">{formatCurrency(total)}</span>
                          <button
                            onClick={() => setExpanded((prev) => ({ ...prev, [o.id]: !prev[o.id] }))}
                            className="px-4 py-2 rounded-full border border-[var(--color-morado)]/20 text-[var(--color-morado)] hover:bg-[var(--color-rosa)] hover:text-white transition"
                          >
                            {isOpen ? "Ocultar" : "Ver productos"}
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {o.products.map((p) => (
                            <div key={p.id} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3 shadow-sm">
                              <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                                {p.image ? (
                                  <Image src={p.image} alt={p.name} width={64} height={64} className="h-16 w-16 object-cover" />
                                ) : (
                                  <div className="h-16 w-16 grid place-items-center text-gray-400">
                                    <FiShoppingBag />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-gray-800">{p.name}</p>
                                <p className="text-sm text-gray-600">{formatCurrency(p.price ?? 0)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
