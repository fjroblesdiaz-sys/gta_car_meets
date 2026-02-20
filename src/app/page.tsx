"use client";

import Link from "next/link";
import { useApp, useAuth } from "@/context/AppContext";
import { Plus, ArrowRight, MapPin, Calendar, Users, Car, LogIn, UserPlus, Clock } from "lucide-react";

export default function Home() {
  const { cars, meets } = useApp();
  const { user } = useAuth();

  const nextMeets = meets
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

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
                  <span className="text-gray-400 text-xs tracking-wider">TOTAL</span>
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

            <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}>
              <div className="h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    <h2 className="text-lg font-bold text-white">QUEDADAS ACTIVAS</h2>
                  </div>
                  <Link href="/meets" className="text-yellow-500 text-sm hover:underline">Ver todas</Link>
                </div>
                
                {nextMeets.length > 0 ? (
                  <div className="space-y-3">
                    {nextMeets.map((meet) => (
                      <div 
                        key={meet.id}
                        className="p-3 rounded-xl bg-gray-800/50 border border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-white text-sm">{meet.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1 text-gray-400">
                                <MapPin size={12} className="text-yellow-500" />
                                <span className="text-xs">{meet.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-400">
                                <Calendar size={12} className="text-yellow-500" />
                                <span className="text-xs">{formatDate(meet.date)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-400">
                                <Clock size={12} className="text-yellow-500" />
                                <span className="text-xs">{meet.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Users size={14} />
                            <span className="text-xs font-bold">{meet.participants.length}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">No hay quedadas programadas</p>
                )}
              </div>
            </div>

            {nextMeets.length === 0 && (
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
