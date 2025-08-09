// src/context/AuthContext.tsx
"use client";

import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from "react";
import { UserSessionInterface } from "@/interfaces/userSession.interface";
// (opcional) si tienes un axiosInstance global, impórtalo y limpia el header en logout
// import { axiosInstance } from "@/lib/api";

interface AuthContextProps {
  dataUser: UserSessionInterface | null;
  setDataUser: (dataUser: UserSessionInterface | null) => void; // compat
  login: (session: UserSessionInterface) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
   children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  dataUser: null,
  setDataUser: () => {},
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [dataUser, setDataUser] = useState<UserSessionInterface | null>(null);

  // Cargar sesión al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userSession");
      setDataUser(raw ? JSON.parse(raw) : null);
    } catch {
      setDataUser(null);
    }
  }, []);

  // Sincronizar entre pestañas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userSession") {
        try {
          const raw = localStorage.getItem("userSession");
          setDataUser(raw ? JSON.parse(raw) : null);
        } catch {
          setDataUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((session: UserSessionInterface) => {
    setDataUser(session);
    localStorage.setItem("userSession", JSON.stringify(session));
    window.dispatchEvent(new CustomEvent("sessionChanged"));
    // (opcional) setear header de auth global
    // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${session.token}`;
  }, []);

  const logout = useCallback(() => {
    setDataUser(null);
    localStorage.removeItem("userSession");
    window.dispatchEvent(new CustomEvent("sessionChanged"));
    // (opcional) limpiar header de auth global
    // delete axiosInstance.defaults.headers.common["Authorization"];
  }, []);

  const isAuthenticated = useMemo(() => !!dataUser && Object.keys(dataUser as any).length > 0, [dataUser]);

  return (
    <AuthContext.Provider value={{ dataUser, setDataUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
