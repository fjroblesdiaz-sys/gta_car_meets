"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Car, Meet, ChatMessage, AppData } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}

interface AppContextType {
  cars: Car[];
  meets: Meet[];
  messages: ChatMessage[];
  addCar: (car: Omit<Car, "id" | "createdAt" | "userId">) => void;
  deleteCar: (id: string) => void;
  addMeet: (meet: Omit<Meet, "id" | "createdAt" | "participants" | "userId">) => void;
  deleteMeet: (id: string) => void;
  joinMeet: (meetId: string, playerName: string) => void;
  leaveMeet: (meetId: string, playerName: string) => void;
  sendMessage: (text: string) => void;
  getUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "gta-car-meets-data";
const AUTH_KEY = "gta-car-meets-auth";

function getStoredData(): AppData {
  if (typeof window === "undefined") return { users: [], cars: [], meets: [], messages: [] };
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        users: parsed.users || [],
        cars: parsed.cars || [],
        meets: parsed.meets || [],
        messages: parsed.messages || []
      };
    } catch {
      return { users: [], cars: [], meets: [], messages: [] };
    }
  }
  return { users: [], cars: [], meets: [], messages: [] };
}

function setStoredData(data: AppData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ users: [], cars: [], meets: [], messages: [] });
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedData = getStoredData();
    setData(storedData);
    
    const authUser = localStorage.getItem(AUTH_KEY);
    if (authUser) {
      try {
        setUser(JSON.parse(authUser));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const currentData = getStoredData();
    const foundUser = currentData.users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(foundUser));
      return true;
    }
    return false;
  }, []);

  const register = useCallback((username: string, email: string, password: string): boolean => {
    const currentData = getStoredData();
    const exists = currentData.users.some(u => u.email === email);
    if (exists) {
      return false;
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      password,
      createdAt: Date.now(),
    };
    const updatedData = { ...currentData, users: [...currentData.users, newUser] };
    setStoredData(updatedData);
    setData(updatedData);
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const addCar = useCallback((car: Omit<Car, "id" | "createdAt" | "userId">) => {
    if (!user) return;
    const newCar: Car = {
      ...car,
      userId: user.id,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setData((prev) => {
      const updated = { ...prev, cars: [...prev.cars, newCar] };
      setStoredData(updated);
      return updated;
    });
  }, [user]);

  const deleteCar = useCallback((id: string) => {
    setData((prev) => {
      const updated = { ...prev, cars: prev.cars.filter((c) => c.id !== id) };
      setStoredData(updated);
      return updated;
    });
  }, []);

  const addMeet = useCallback((meet: Omit<Meet, "id" | "createdAt" | "participants" | "userId">) => {
    if (!user) return;
    const newMeet: Meet = {
      ...meet,
      userId: user.id,
      id: crypto.randomUUID(),
      participants: [],
      createdAt: Date.now(),
    };
    setData((prev) => {
      const updated = { ...prev, meets: [...prev.meets, newMeet] };
      setStoredData(updated);
      return updated;
    });
  }, [user]);

  const deleteMeet = useCallback((id: string) => {
    setData((prev) => {
      const updated = { ...prev, meets: prev.meets.filter((m) => m.id !== id) };
      setStoredData(updated);
      return updated;
    });
  }, []);

  const joinMeet = useCallback((meetId: string, playerName: string) => {
    setData((prev) => ({
      ...prev,
      meets: prev.meets.map((m) =>
        m.id === meetId && !m.participants.includes(playerName)
          ? { ...m, participants: [...m.participants, playerName] }
          : m
      ),
    }));
  }, []);

  const leaveMeet = useCallback((meetId: string, playerName: string) => {
    setData((prev) => ({
      ...prev,
      meets: prev.meets.map((m) =>
        m.id === meetId
          ? { ...m, participants: m.participants.filter((p) => p !== playerName) }
          : m
      ),
    }));
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!user || !text.trim()) return;
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      userId: user.id,
      username: user.username,
      text: text.trim(),
      createdAt: Date.now(),
    };
    setData((prev) => {
      const updated = { ...prev, messages: [...prev.messages, newMessage] };
      setStoredData(updated);
      return updated;
    });
  }, [user]);

  const getUsers = useCallback(() => {
    return data.users;
  }, [data.users]);

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <AppContext.Provider
        value={{
          cars: data.cars.filter(c => !user || c.userId === user.id || !c.userId),
          meets: data.meets,
          messages: data.messages,
          addCar,
          deleteCar,
          addMeet,
          deleteMeet,
          joinMeet,
          leaveMeet,
          sendMessage,
          getUsers,
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
