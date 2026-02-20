"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp, useAuth } from "@/context/AppContext";
import { Send, ArrowLeft, MessageCircle, Plus, Hash, Users } from "lucide-react";

export default function Chat() {
  const router = useRouter();
  const { user } = useAuth();
  const { messages, sendMessage, chatRooms, createChatRoom, getMessagesForRoom } = useApp();
  const [text, setText] = useState("");
  const [currentRoom, setCurrentRoom] = useState("global");
  const [showRoomList, setShowRoomList] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomMessages = getMessagesForRoom(currentRoom);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text, currentRoom);
      setText("");
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createChatRoom(newRoomName.trim());
      setNewRoomName("");
      setShowCreateRoom(false);
    }
  };

  const currentRoomData = chatRooms.find(r => r.id === currentRoom);

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
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <button
            onClick={() => setShowCreateRoom(true)}
            className="-2 px-3flex items-center gap py-2 rounded-lg bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
          >
            <Plus size={18} />
            <span className="text-sm">Nueva sala</span>
          </button>
        </div>
        
        <button
          onClick={() => setShowRoomList(!showRoomList)}
          className="w-full flex items-center justify-between p-3 rounded-xl"
          style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-yellow-500" />
            <span className="font-bold text-white">
              {currentRoomData?.isGlobal ? '🌍' : '#'} {currentRoomData?.name}
            </span>
          </div>
          <Hash size={18} className="text-gray-500" />
        </button>
        
        {showRoomList && (
          <div className="mt-2 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}>
            {chatRooms.map(room => (
              <button
                key={room.id}
                onClick={() => {
                  setCurrentRoom(room.id);
                  setShowRoomList(false);
                }}
                className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-800 transition-colors ${room.id === currentRoom ? 'bg-yellow-500/10' : ''}`}
              >
                {room.isGlobal ? <Users size={16} className="text-green-500" /> : <Hash size={16} className="text-gray-500" />}
                <span className={room.id === currentRoom ? 'text-yellow-500' : 'text-gray-300'}>
                  {room.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-2">
        {roomMessages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">No hay mensajes aún</p>
            <p className="text-gray-600 text-sm">Sé el primero en escribir en esta sala</p>
          </div>
        ) : (
          roomMessages.map((msg) => (
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
            placeholder={`Escribir en #${currentRoomData?.name}...`}
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

      {showCreateRoom && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)' }}
        >
          <div 
            className="rounded-2xl p-5 max-w-md w-full"
            style={{ background: 'linear-gradient(145deg, #1f1f1f 0%, #141414 100%)', border: '1px solid #333' }}
          >
            <h3 className="font-bold text-xl text-white mb-4">Crear nueva sala</h3>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Nombre de la sala..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none text-white placeholder-gray-500 mb-4"
              onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateRoom(false)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRoom}
                className="flex-1 py-3 rounded-xl font-bold"
                style={{ background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)' }}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
