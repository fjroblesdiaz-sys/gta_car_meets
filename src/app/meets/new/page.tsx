"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Save, ArrowLeft, MapPin, Calendar, Clock, FileText } from "lucide-react";

export default function NewMeet() {
  const router = useRouter();
  const { addMeet } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !date.trim() || !time.trim()) {
      alert("Por favor, completa todos los campos requeridos");
      return;
    }
    addMeet({ title, description, location, date, time });
    router.push("/meets");
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="p-4 pb-24">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold mb-6" style={{ color: '#f59e0b' }}>NUEVA QUEDADA</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-yellow-500 rounded-full" />
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meet Tuning Los Santos"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <FileText size={14} />
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la quedada..."
              rows={3}
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <MapPin size={14} />
              Ubicación *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Casino Diamond, Vinewood..."
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Calendar size={14} />
                Fecha *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Clock size={14} />
                Hora *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            style={{ 
              background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
              boxShadow: '0 4px 15px rgba(217,119,6,0.3)'
            }}
          >
            <Save size={20} />
            CREAR QUEDADA
          </button>
        </form>
      </div>
    </div>
  );
}
