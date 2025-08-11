// src/components/NavBar.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import PATHROUTES from "@/utils/pathRoutes";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { FaBars, FaTimes, FaUser, FaShoppingCart, FaHome } from "react-icons/fa";

const NavBar = () => {
  const { dataUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Estado de sesión robusto
  const isLoggedIn = useMemo(() => Boolean(dataUser?.token), [dataUser]);


  // shrink + sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // contador carrito (localStorage)
  useEffect(() => {
    const update = () => {
      try {
        const raw = localStorage.getItem("cart");
        if (!raw) return setCartCount(0);
        const parsed = JSON.parse(raw);
        const count = Array.isArray(parsed)
          ? parsed.length
          : Array.isArray(parsed?.items)
          ? parsed.items.length
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    update();
    const onStorage = (e: StorageEvent) => e.key === "cart" && update();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // cerrar menú si crece la pantalla
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // estilos unificados
  const btnBase =
    "relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium shadow-sm " +
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rosa)] hover:-translate-y-0.5 hover:shadow-md";
  // CTA para Inicio, Carrito y Perfil (idénticos)
  const btnCTA = `${btnBase} border border-[var(--color-morado)]/20 bg-white text-[var(--color-morado)] hover:bg-[var(--color-rosa)] hover:text-white`;
  // Solo Login distinto
  const btnLogin = `${btnBase} bg-[var(--color-morado)] text-white hover:bg-[var(--color-rosa)]`;

  return (
    <nav
      className={`w-full sticky top-0 z-50 border-b border-[var(--color-morado)]/10 bg-white/80 backdrop-blur-md transition-all ${
        isScrolled ? "py-1 shadow-[0_8px_24px_-18px_rgba(0,0,0,.35)]" : "py-2"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex h-16 items-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rosa)]"
          >
            <Image
              src="/navbar.png"
              alt="Logo"
              width={180}
              height={60}
              priority
              className="h-12 w-auto object-contain transition-transform duration-200 hover:scale-[1.03]"
            />
          </Link>
        </div>

        {/* Hamburguesa (mobile) */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-morado)] hover:bg-[var(--color-rosa)] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rosa)]"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Acciones (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Inicio (siempre) */}
          <Link href={PATHROUTES.HOME} className={btnCTA}>
            <FaHome className="h-4 w-4" />
            <span>Inicio</span>
          </Link>

          {/* Sesión */}
          {isLoggedIn ? (
            <>
              {/* Carrito */}
              <Link href={PATHROUTES.CART} className={btnCTA} aria-label="Ir al carrito">
                <FaShoppingCart className="h-4 w-4" />
                <span>Carrito</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--color-morado)] text-white text-[10px] font-extrabold">
                    {cartCount}
                  </span>
                )}
              </Link>
              {/* Perfil */}
              <Link href={PATHROUTES.DASHBOARD} className={btnCTA}>
                <FaUser className="h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </>
          ) : (
            // Login (único botón adicional cuando NO hay sesión)
            <Link href={PATHROUTES.LOGIN} className={btnLogin}>
              <span>Login</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Menú mobile */}
        <div
          className={`absolute md:hidden top-[64px] left-0 w-full bg-white shadow-xl transition-all duration-300 ${
            isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-2 p-4">
            {/* Inicio (siempre) */}
            <Link href={PATHROUTES.HOME} onClick={() => setIsOpen(false)} className={`${btnCTA} justify-center`}>
              <FaHome className="h-4 w-4" />
              Inicio
            </Link>

            {/* Sesión */}
            {isLoggedIn ? (
              <>
                <Link href={PATHROUTES.CART} onClick={() => setIsOpen(false)} className={`${btnCTA} justify-center`}>
                  <FaShoppingCart className="h-4 w-4" />
                  Ir al carrito
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--color-morado)] text-white text-[10px] font-extrabold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href={PATHROUTES.DASHBOARD} onClick={() => setIsOpen(false)} className={`${btnCTA} justify-center`}>
                  <FaUser className="h-4 w-4" />
                  Perfil
                </Link>
              </>
            ) : (
              <Link href={PATHROUTES.LOGIN} onClick={() => setIsOpen(false)} className={`${btnLogin} justify-center`}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
