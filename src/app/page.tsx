"use client";

import Link from "next/link";
import { useApp, useAuth } from "@/context/AppContext";
import { Plus, ArrowRight, MapPin, Calendar, Users, Car, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  const { cars, meets } = useApp();
  const { user } = useAuth();

  const nextMeet = meets
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="p-4 pb-24">
        <header className="text-center py-6 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <span className="text-9xl font-black">GTA</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-wider" style={{ 
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none'
          }}>
            CAR MEETS
          </h1>
          <p className="text-gray-500 text-sm mt-1 tracking-[0.3em] uppercase">Los Santos Customs</p>
          {user && (
            <p className="text-yellow-500 text-xs mt-2">Bienvenido, {user.username}</p>
          )}
        </header>

        {!user ? (
          <div className="space-y-3 mb-6">
            <Link
              href="/login"
              className="group relative overflow-hidden rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:pl-6"
              style={{ 
                background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
                boxShadow: '0 4px 15px rgba(217,119,6,0.3)'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <LogIn size={22} className="text-white" />
                </div>
                <span className="font-bold text-white tracking-wide">INICIAR SESIÓN</span>
              </div>
              <ArrowRight size={20} className="text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="group relative overflow-hidden rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:pl-6"
              style={{ 
                background: 'linear-gradient(90deg, #1f1f1f 0%, #2a2a2a 100%)',
                border: '1px solid #333'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <UserPlus size={22} className="text-yellow-500" />
                </div>
                <span className="font-bold text-white tracking-wide">REGISTRARSE</span>
              </div>
              <ArrowRight size={20} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link
                href="/garage"
                className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20"
                style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-3 group-hover:bg-yellow-500/30 transition-colors">
                    <Car size={24} className="text-yellow-500" />
                  </div>
                  <span className="text-gray-400 text-xs tracking-wider">TUS</span>
                  <div className="text-3xl font-bold text-white">{cars.length}</div>
                  <span className="text-yellow-500 text-sm font-medium">COCHES</span>
                </div>
              </Link>
              <Link
                href="/meets"
                className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20"
                style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-3 group-hover:bg-yellow-500/30 transition-colors">
                    <Users size={24} className="text-yellow-500" />
                  </div>
                  <span className="text-gray-400 text-xs tracking-wider">TUS</span>
                  <div className="text-3xl font-bold text-white">{meets.length}</div>
                  <span className="text-yellow-500 text-sm font-medium">QUEDADAS</span>
                </div>
              </Link>
            </div>

            <div className="space-y-3 mb-6">
              <Link
                href="/garage/new"
                className="group relative overflow-hidden rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:pl-6"
                style={{ 
                  background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
                  boxShadow: '0 4px 15px rgba(217,119,6,0.3)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Plus size={22} className="text-white" />
                  </div>
                  <span className="font-bold text-white tracking-wide">AÑADIR COCHE</span>
                </div>
                <ArrowRight size={20} className="text-white/70 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/meets/new"
                className="group relative overflow-hidden rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:pl-6"
                style={{ 
                  background: 'linear-gradient(90deg, #1f1f1f 0%, #2a2a2a 100%)',
                  border: '1px solid #333'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Plus size={22} className="text-yellow-500" />
                  </div>
                  <span className="font-bold text-white tracking-wide">CREAR QUEDADA</span>
                </div>
                <ArrowRight size={20} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {nextMeet && (
              <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}>
                <div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded">PRÓXIMA</span>
                    <span className="text-gray-500 text-xs">QUEDADA</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3">{nextMeet.title}</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-yellow-500" />
                      <span className="text-sm">{nextMeet.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} className="text-yellow-500" />
                      <span className="text-sm">{nextMeet.date} • {nextMeet.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={14} className="text-yellow-500" />
                      <span className="text-sm">{nextMeet.participants.length} participantes</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!nextMeet && meets.length > 0 && (
              <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}>
                <p className="text-gray-400">No hay quedadas próximas</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
