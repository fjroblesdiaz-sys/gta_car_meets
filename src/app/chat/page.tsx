"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp, useAuth } from "@/context/AppContext";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";

export default function Chat() {
  const router = useRouter();
  const { user } = useAuth();
  const { messages, sendMessage } = useApp();
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText("");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="p-4 pb-2">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#f59e0b' }}>
          <MessageCircle size={24} />
          CHAT
        </h1>
        <p className="text-gray-500 text-xs">Comunicación entre jugadores</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-2">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">No hay mensajes aún</p>
            <p className="text-gray-600 text-sm">Sé el primero en escribir</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.userId === user.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl p-3 ${
                  msg.userId === user.id
                    ? "bg-yellow-600 text-white rounded-br-md"
                    : "bg-gray-800 text-gray-200 rounded-bl-md"
                }`}
              >
                {msg.userId !== user.id && (
                  <p className="text-xs font-bold text-yellow-500 mb-1">{msg.username}</p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.userId === user.id ? "text-yellow-200" : "text-gray-500"}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 pb-24">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            className="px-4 rounded-xl flex items-center justify-center transition-colors"
            style={{ 
              background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
            }}
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
