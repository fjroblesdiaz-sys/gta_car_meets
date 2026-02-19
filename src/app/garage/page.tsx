"use client";

import Link from "next/link";
import { Plus, Trash2, Car as CarIcon, X, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function Garage() {
  const { cars, deleteCar } = useApp();
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="p-4 pb-24">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#f59e0b' }}>GARAJE</h1>
            <p className="text-gray-500 text-xs tracking-wider">TUS COCHES</p>
          </div>
          <Link
            href="/garage/new"
            className="px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
            style={{ 
              background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
              boxShadow: '0 4px 15px rgba(217,119,6,0.3)'
            }}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">AÑADIR</span>
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <CarIcon size={36} className="text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">No tienes coches en el garaje</p>
            <Link 
              href="/garage/new" 
              className="inline-block px-6 py-3 rounded-xl font-bold"
              style={{ background: '#d97706' }}
            >
              Añadir tu primer coche
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {cars.map((car) => (
              <div 
                key={car.id} 
                className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}
              >
                <div className="aspect-video bg-gray-900 relative">
                  {car.imageUrl ? (
                    <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CarIcon size={48} className="text-gray-700" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => deleteCar(car.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/40 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl text-white">{car.name}</h3>
                      <p className="text-gray-400 text-sm">{car.model}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCar(car.id)}
                    className="mt-4 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    style={{ background: 'rgba(234,179,8,0.1)', color: '#fbbf24' }}
                  >
                    <Settings size={16} />
                    Ver modificaciones ({car.mods.length})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCar && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)' }}
          >
            <div 
              className="rounded-2xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto"
              style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-white">
                  {cars.find((c) => c.id === selectedCar)?.name}
                </h3>
                <button onClick={() => setSelectedCar(null)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              {cars.find((c) => c.id === selectedCar)?.mods.length === 0 ? (
                <p className="text-gray-400">Sin modificaciones</p>
              ) : (
                <ul className="space-y-2">
                  {cars
                    .find((c) => c.id === selectedCar)
                    ?.mods.map((mod, i) => (
                      <li 
                        key={i} 
                        className="bg-gray-800/50 rounded-lg p-3 text-gray-300 border-l-2 border-yellow-500"
                      >
                        {mod}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
