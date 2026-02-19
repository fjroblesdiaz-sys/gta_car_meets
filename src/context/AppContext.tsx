"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Car, Meet, ChatMessage } from "@/types";

const USE_API = false; // Cambiar a true cuando desplegues la API

const API_URL = "http://localhost:3001/api";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "gta-car-meets-data";
const AUTH_KEY = "gta-car-meets-auth";

const defaultData = {
  users: [] as User[],
  cars: [] as Car[],
  meets: [] as Meet[],
  messages: [] as ChatMessage[]
};

function loadData() {
  if (typeof window === "undefined") return defaultData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        cars: Array.isArray(parsed.cars) ? parsed.cars : [],
        meets: Array.isArray(parsed.meets) ? parsed.meets : [],
        messages: Array.isArray(parsed.messages) ? parsed.messages : []
      };
    }
  } catch (e) {
    console.error("Error loading data:", e);
  }
  return defaultData;
}

function saveData(data: typeof defaultData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving data:", e);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(defaultData);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadedData = loadData();
    setData(loadedData);
    
    const authUser = localStorage.getItem(AUTH_KEY);
    if (authUser) {
      try {
        setUser(JSON.parse(authUser));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setMounted(true);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (USE_API) {
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
    } else {
      const found = data.users.find(u => u.email === email && u.password === password);
      if (found) {
        setUser(found);
        localStorage.setItem(AUTH_KEY, JSON.stringify(found));
        return true;
      }
      return false;
    }
  }, [data.users]);

  const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    if (USE_API) {
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
    } else {
      if (data.users.some(u => u.email === email)) {
        return false;
      }
      const newUser: User = {
        id: crypto.randomUUID(),
        username,
        email,
        password,
        createdAt: Date.now()
      };
      const newData = { ...data, users: [...data.users, newUser] };
      setData(newData);
      saveData(newData);
      setUser(newUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      return true;
    }
  }, [data]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const addCar = useCallback(async (car: Omit<Car, "id" | "createdAt" | "userId">) => {
    if (!user) return;
    const newCar: Car = {
      ...car,
      userId: user.id,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    if (USE_API) {
      try {
        const res = await fetch(`${API_URL}/cars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...car, userId: user.id })
        });
        if (res.ok) {
          const savedCar = await res.json();
          setData(prev => ({ ...prev, cars: [...prev.cars, savedCar] }));
        }
      } catch (e) { console.error(e); }
    } else {
      const newData = { ...data, cars: [...data.cars, newCar] };
      setData(newData);
      saveData(newData);
    }
  }, [user, data]);

  const deleteCar = useCallback(async (id: string) => {
    if (USE_API) {
      try {
        await fetch(`${API_URL}/cars/${id}`, { method: "DELETE" });
      } catch (e) { console.error(e); }
    }
    const newData = { ...data, cars: data.cars.filter(c => c.id !== id) };
    setData(newData);
    saveData(newData);
  }, [data]);

  const addMeet = useCallback(async (meet: Omit<Meet, "id" | "createdAt" | "participants" | "userId">) => {
    if (!user) return;
    const newMeet: Meet = {
      ...meet,
      userId: user.id,
      id: crypto.randomUUID(),
      participants: [],
      createdAt: Date.now()
    };
    if (USE_API) {
      try {
        const res = await fetch(`${API_URL}/meets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...meet, userId: user.id })
        });
        if (res.ok) {
          const savedMeet = await res.json();
          setData(prev => ({ ...prev, meets: [...prev.meets, savedMeet] }));
        }
      } catch (e) { console.error(e); }
    } else {
      const newData = { ...data, meets: [...data.meets, newMeet] };
      setData(newData);
      saveData(newData);
    }
  }, [user, data]);

  const deleteMeet = useCallback(async (id: string) => {
    if (USE_API) {
      try {
        await fetch(`${API_URL}/meets/${id}`, { method: "DELETE" });
      } catch (e) { console.error(e); }
    }
    const newData = { ...data, meets: data.meets.filter(m => m.id !== id) };
    setData(newData);
    saveData(newData);
  }, [data]);

  const joinMeet = useCallback(async (meetId: string, playerName: string) => {
    if (USE_API) {
      try {
        const res = await fetch(`${API_URL}/meets/${meetId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName })
        });
        if (res.ok) {
          const updatedMeet = await res.json();
          setData(prev => ({
            ...prev,
            meets: prev.meets.map(m => m.id === meetId ? updatedMeet : m)
          }));
        }
      } catch (e) { console.error(e); }
    } else {
      const newData = {
        ...data,
        meets: data.meets.map(m => 
          m.id === meetId && !m.participants.includes(playerName)
            ? { ...m, participants: [...m.participants, playerName] }
            : m
        )
      };
      setData(newData);
      saveData(newData);
    }
  }, [data]);

  const leaveMeet = useCallback(async (meetId: string, playerName: string) => {
    if (USE_API) {
      try {
        const res = await fetch(`${API_URL}/meets/${meetId}/leave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName })
        });
        if (res.ok) {
          const updatedMeet = await res.json();
          setData(prev => ({
            ...prev,
            meets: prev.meets.map(m => m.id === meetId ? updatedMeet : m)
          }));
        }
      } catch (e) { console.error(e); }
    } else {
      const newData = {
        ...data,
        meets: data.meets.map(m =>
          m.id === meetId
            ? { ...m, participants: m.participants.filter(p => p !== playerName) }
            : m
        )
      };
      setData(newData);
      saveData(newData);
    }
  }, [data]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !text.trim()) return;
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId: user.id,
      username: user.username,
      text: text.trim(),
      createdAt: Date.now()
    };
    if (USE_API) {
      try {
        const res = await fetch(`${API_URL}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, username: user.username, text: text.trim() })
        });
        if (res.ok) {
          const savedMsg = await res.json();
          setData(prev => ({ ...prev, messages: [...prev.messages, savedMsg] }));
        }
      } catch (e) { console.error(e); }
    } else {
      const newData = { ...data, messages: [...data.messages, newMessage] };
      setData(newData);
      saveData(newData);
    }
  }, [user, data]);

  if (!mounted) {
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
          cars: data.cars,
          meets: data.meets,
          messages: data.messages,
          loading: false,
          addCar,
          deleteCar,
          addMeet,
          deleteMeet,
          joinMeet,
          leaveMeet,
          sendMessage
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
