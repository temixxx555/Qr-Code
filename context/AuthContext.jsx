"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const response = await api.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Check authentication when app loads
   useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser();
    };
    initializeAuth();
  }, []);

  async function login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to login",
      };
    }
  }

  async function register(name, email, password) {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to create account",
      };
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");

      setUser(null);

      return {
        success: true,
      };
    } catch (error) {
      setUser(null);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to logout",
      };
    }
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}