/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("thinkboard_token"));
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("thinkboard_token");
      if (storedToken) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
          setToken(storedToken);
        } catch (error) {
          console.warn("Session expired or invalid token:", error.message);
          localStorage.removeItem("thinkboard_token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Response interceptor to handle 401 Unauthorized
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Ignore 401 on /auth/me or /auth/google to avoid infinite loops
          const url = error.config?.url || "";
          if (!url.includes("/auth/me") && !url.includes("/auth/login")) {
            localStorage.removeItem("thinkboard_token");
            setToken(null);
            setUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const loginAsGuest = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/guest");
      const { user: userData, token: newToken } = res.data;

      localStorage.setItem("thinkboard_token", newToken);
      setToken(newToken);
      setUser(userData);
      toast.success("Welcome! Signed in as Guest.");
      return userData;
    } catch (error) {
      console.error("Guest login error:", error);
      toast.error("Failed to start guest session.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      setLoading(true);
      // Pass guestUserId if currently signed in as a Guest to trigger note migration
      const guestUserId = user && user.isGuest ? user._id : null;

      const res = await api.post("/auth/google", {
        credential,
        guestUserId,
      });

      const { user: userData, token: newToken, mergedNotesCount } = res.data;

      localStorage.setItem("thinkboard_token", newToken);
      setToken(newToken);
      setUser(userData);

      if (mergedNotesCount > 0) {
        toast.success(
          `Signed in as ${userData.name}! ${mergedNotesCount} guest note${
            mergedNotesCount > 1 ? "s" : ""
          } transferred to your account.`,
          { duration: 5000 }
        );
      } else {
        toast.success(`Welcome back, ${userData.name}!`);
      }

      return userData;
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(
        error.response?.data?.message || "Google sign-in failed. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("thinkboard_token");
    setToken(null);
    setUser(null);
    toast.success("Signed out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginAsGuest,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
