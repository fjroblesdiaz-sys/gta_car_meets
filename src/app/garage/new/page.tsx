"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Plus, X, Save, ArrowLeft, Car } from "lucide-react";

export default function NewCar() {
  const router = useRouter();
  const { addCar } = useApp();
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mods, setMods] = useState<string[]>([]);
  const [newMod, setNewMod] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !model.trim()) {
      alert("Por favor, completa todos los campos requeridos");
      return;
    }
    addCar({ name, model, mods, imageUrl: imageUrl || undefined });
    router.push("/garage");
  };

  const addMod = () => {
    if (newMod.trim()) {
      setMods([...mods, newMod.trim()]);
      setNewMod("");
    }
  };

  const removeMod = (index: number) => {
    setMods(mods.filter((_, i) => i !== index));
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

        <h1 className="text-2xl font-bold mb-6" style={{ color: '#f59e0b' }}>NUEVO COCHE</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-yellow-500 rounded-full" />
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi Supra"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-yellow-500 rounded-full" />
              Modelo *
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Toyota Supra MK4"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              URL de imagen (opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Modificaciones</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMod}
                onChange={(e) => setNewMod(e.target.value)}
                placeholder="Añadir modificación..."
                className="flex-1 bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMod())}
              />
              <button
                type="button"
                onClick={addMod}
                className="px-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Plus size={24} className="text-yellow-500" />
              </button>
            </div>
            {mods.length > 0 && (
              <ul className="mt-4 space-y-2">
                {mods.map((mod, i) => (
                  <li 
                    key={i} 
                    className="bg-gray-800/50 rounded-lg p-3 flex justify-between items-center border-l-2 border-yellow-500"
                  >
                    <span className="text-gray-300">{mod}</span>
                    <button 
                      type="button" 
                      onClick={() => removeMod(i)} 
                      className="text-red-500 hover:text-red-400"
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
            GUARDAR COCHE
          </button>
        </form>
      </div>
    </div>
  );
}
