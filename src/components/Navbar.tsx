"use client";

import Link from "next/link";
import { Car, Home, Users, Warehouse, LogOut, User, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AppContext";

const navItems = [
  { href: "/", icon: Home, label: "INICIO" },
  { href: "/garage", icon: Warehouse, label: "GARAJE" },
  { href: "/meets", icon: Users, label: "QUEDADAS" },
  { href: "/chat", icon: MessageCircle, label: "CHAT" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(20,20,20,0.9))' }}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto border-t border-yellow-600/30">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isActive 
                  ? "text-yellow-500 scale-110" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
              style={{
                textShadow: isActive ? "0 0 10px rgba(234,179,8,0.5)" : "none"
              }}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[9px] mt-1 font-bold tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-yellow-500 rounded-full" />
              )}
            </Link>
          );
        })}
        {user ? (
          <button
            onClick={logout}
            className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={22} />
            <span className="text-[9px] mt-1 font-bold tracking-wider">SALIR</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-yellow-500 transition-colors"
          >
            <User size={22} />
            <span className="text-[9px] mt-1 font-bold tracking-wider">LOGIN</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
