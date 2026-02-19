"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Car, Meet, ChatMessage } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AppContextType {
  cars: Car[];
  meets: Meet[];
  messages: ChatMessage[];
  loading: boolean;
  addCar: (car: Omit<Car, "id" | "createdAt" | "userId">) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  addMeet: (meet: Omit<Meet, "id" | "createdAt" | "participants" | "userId">) => Promise<void>;
  deleteMeet: (id: string) => Promise<void>;
  joinMeet: (meetId: string, playerName: string) => Promise<void>;
  leaveMeet: (meetId: string, playerName: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_KEY = "gta-car-meets-auth";

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [meets, setMeets] = useState<Meet[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [carsRes, meetsRes, msgsRes] = await Promise.all([
        fetch(`${API_URL}/cars`),
        fetch(`${API_URL}/meets`),
        fetch(`${API_URL}/messages`)
      ]);
      setCars(await carsRes.json());
      setMeets(await meetsRes.json());
      setMessages(await msgsRes.json());
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  }, []);

  useEffect(() => {
    const authUser = localStorage.getItem(AUTH_KEY);
    if (authUser) {
      try {
        setUser(JSON.parse(authUser));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    refreshData().then(() => setLoading(false));
  }, [refreshData]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        return true;
      }
    } catch (e) {
      console.error("Login error:", e);
    }
    return false;
  }, []);

  const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        return true;
      }
    } catch (e) {
      console.error("Register error:", e);
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const addCar = useCallback(async (car: Omit<Car, "id" | "createdAt" | "userId">) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...car, userId: user.id })
      });
      if (res.ok) {
        const newCar = await res.json();
        setCars(prev => [...prev, newCar]);
      }
    } catch (e) {
      console.error("Error adding car:", e);
    }
  }, [user]);

  const deleteCar = useCallback(async (id: string) => {
    try {
      await fetch(`${API_URL}/cars/${id}`, { method: "DELETE" });
      setCars(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error("Error deleting car:", e);
    }
  }, []);

  const addMeet = useCallback(async (meet: Omit<Meet, "id" | "createdAt" | "participants" | "userId">) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/meets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...meet, userId: user.id })
      });
      if (res.ok) {
        const newMeet = await res.json();
        setMeets(prev => [...prev, newMeet]);
      }
    } catch (e) {
      console.error("Error adding meet:", e);
    }
  }, [user]);

  const deleteMeet = useCallback(async (id: string) => {
    try {
      await fetch(`${API_URL}/meets/${id}`, { method: "DELETE" });
      setMeets(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error("Error deleting meet:", e);
    }
  }, []);

  const joinMeet = useCallback(async (meetId: string, playerName: string) => {
    try {
      const res = await fetch(`${API_URL}/meets/${meetId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName })
      });
      if (res.ok) {
        const updatedMeet = await res.json();
        setMeets(prev => prev.map(m => m.id === meetId ? updatedMeet : m));
      }
    } catch (e) {
      console.error("Error joining meet:", e);
    }
  }, []);

  const leaveMeet = useCallback(async (meetId: string, playerName: string) => {
    try {
      const res = await fetch(`${API_URL}/meets/${meetId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName })
      });
      if (res.ok) {
        const updatedMeet = await res.json();
        setMeets(prev => prev.map(m => m.id === meetId ? updatedMeet : m));
      }
    } catch (e) {
      console.error("Error leaving meet:", e);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !text.trim()) return;
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, username: user.username, text: text.trim() })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (e) {
      console.error("Error sending message:", e);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <AppContext.Provider
        value={{
          cars,
          meets,
          messages,
          loading,
          addCar,
          deleteCar,
          addMeet,
          deleteMeet,
          joinMeet,
          leaveMeet,
          sendMessage,
          refreshData
        }}
      >
        {children}
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AppProvider");
  return context;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
