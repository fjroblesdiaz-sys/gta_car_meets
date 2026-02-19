"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AppContext";
import { LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos");
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      const success = login(email.trim(), password);
      if (!success) {
        setError("Email o contraseña incorrectos. ¿Te has registrado antes?");
      } else {
        router.push("/");
      }
      setLoading(false);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#f59e0b' }}>
          INICIAR SESIÓN
        </h1>
        <p className="text-gray-500 text-center mb-8">GTA CAR MEETS</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-600"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ 
              background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
              boxShadow: '0 4px 15px rgba(217,119,6,0.3)'
            }}
          >
            <LogIn size={20} />
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-yellow-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
