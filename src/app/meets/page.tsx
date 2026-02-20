"use client";

import Link from "next/link";
import { useApp, useAuth } from "@/context/AppContext";
import { useState } from "react";
import { Plus, MapPin, Calendar, Clock, Trash2, UserPlus, Users, X, Check, LogIn } from "lucide-react";

export default function Meets() {
  const { user } = useAuth();
  const { meets, users, joinMeet, deleteMeet, addUserToMeet, removeUserFromMeet } = useApp();
  const [joinName, setJoinName] = useState("");
  const [showUserModal, setShowUserModal] = useState<string | null>(null);

  const sortedMeets = [...meets].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleJoinWithAccount = (meetId: string) => {
    if (user) {
      joinMeet(meetId, user.username);
    }
  };

  const handleJoin = (meetId: string) => {
    const name = joinName.trim();
    if (name) {
      joinMeet(meetId, name);
      setJoinName("");
    }
  };

  const isUserInMeet = (meet: typeof meets[0], checkUserId?: string) => {
    const idToCheck = checkUserId || user?.id;
    if (!idToCheck) return false;
    return meet.participants.some(p => typeof p === 'object' ? p.id === idToCheck : p === idToCheck);
  };

  const getParticipantName = (p: string | { id: string; username: string }) => {
    return typeof p === 'object' ? p.username : p;
  };

  const availableUsers = (meetId: string) => {
    const meet = meets.find(m => m.id === meetId);
    if (!meet) return [];
    return users.filter(u => !isUserInMeet(meet, u.id));
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="p-4 pb-24">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#f59e0b' }}>QUEDADAS</h1>
            <p className="text-gray-500 text-xs tracking-wider">GTA CAR MEETS</p>
          </div>
          <Link
            href="/meets/new"
            className="px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
            style={{ 
              background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
              boxShadow: '0 4px 15px rgba(217,119,6,0.3)'
            }}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">CREAR</span>
          </Link>
        </div>

        {meets.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <Calendar size={36} className="text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">No hay quedadas programadas</p>
            <Link 
              href="/meets/new" 
              className="inline-block px-6 py-3 rounded-xl font-bold"
              style={{ background: '#d97706' }}
            >
              Crear primera quedada
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMeets.map((meet) => (
              <div 
                key={meet.id} 
                className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}
              >
                <div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600" />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-white">{meet.title}</h3>
                    <button 
                      onClick={() => deleteMeet(meet.id)} 
                      className="text-gray-600 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{meet.description || "Sin descripción"}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-yellow-500" />
                      <span>{meet.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} className="text-yellow-500" />
                      <span>{meet.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} className="text-yellow-500" />
                      <span>{meet.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <span className="text-yellow-500 text-xs font-bold">{meet.participants.length}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {meet.participants.length} participante{meet.participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {user && (
                        isUserInMeet(meet) ? (
                          <span className="text-green-500 text-xs font-medium px-2 py-1 bg-green-500/10 rounded-lg">
                            ✓ Inscrito
                          </span>
                        ) : (
                          <button
                            onClick={() => handleJoinWithAccount(meet.id)}
                            className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors text-sm font-medium flex items-center gap-1"
                          >
                            <LogIn size={14} />
                            Unirse
                          </button>
                        )
                      )}
                      {user && (
                        <button
                          onClick={() => setShowUserModal(meet.id)}
                          className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition-colors"
                          title="Agregar usuario registrado"
                        >
                          <Users size={16} />
                        </button>
                      )}
                      {!user && (
                        <>
                          <input
                            type="text"
                            value={joinName}
                            onChange={(e) => setJoinName(e.target.value)}
                            placeholder="Tu PSN..."
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm w-28 focus:border-yellow-500 focus:outline-none"
                            onKeyPress={(e) => e.key === "Enter" && handleJoin(meet.id)}
                          />
                          <button
                            onClick={() => handleJoin(meet.id)}
                            className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition-colors"
                          >
                            <UserPlus size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {meet.participants.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-800">
                      <p className="text-xs text-gray-500 mb-2">Participantes:</p>
                      <div className="flex flex-wrap gap-2">
                        {meet.participants.map((p, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                            style={{ background: 'rgba(234,179,8,0.1)', color: '#fbbf24' }}
                          >
                            {getParticipantName(p)}
                            {typeof p === 'object' && user && p.id !== meet.userId && (
                              <button
                                onClick={() => removeUserFromMeet(meet.id, p.id)}
                                className="ml-1 hover:text-red-400"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUserModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)' }}
        >
          <div 
            className="rounded-2xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto"
            style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-white">Agregar usuario</h3>
              <button onClick={() => setShowUserModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            {availableUsers(showUserModal).length === 0 ? (
              <p className="text-gray-400 text-center py-4">No hay usuarios disponibles para agregar</p>
            ) : (
              <div className="space-y-2">
                {availableUsers(showUserModal).map(u => (
                  <div 
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                  >
                    <span className="text-white">{u.username}</span>
                    <button
                      onClick={() => {
                        addUserToMeet(showUserModal, u.id);
                      }}
                      className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
