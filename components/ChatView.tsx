
import React, { useState } from 'react';
import { ChevronLeft, Send, MoreVertical, Paperclip } from 'lucide-react';
import { Conversation, Message } from '../types';

interface ChatViewProps {
  conversation: Conversation;
  onBack: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u2', text: 'Hey there! How have you been?', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: 'm2', senderId: 'u1', text: 'Doing well! Just enjoying the weekend.', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 'm3', senderId: 'u2', text: 'That photo you posted from the valley was incredible!', timestamp: new Date(Date.now() - 1000 * 60 * 5) }
];

export const ChatView: React.FC<ChatViewProps> = ({ conversation, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'u1',
      text: inputText,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFCF9]">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between bg-white border-b border-black/[0.03] z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 -ml-2 text-[#8E8E8E] hover:text-[#2D2D2D]">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img src={conversation.participant.avatar} className="w-8 h-8 rounded-full border border-black/5" alt="" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#2D2D2D] leading-none mb-0.5">{conversation.participant.name}</span>
              <span className="text-[10px] text-[#9EB384] font-bold uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        <button className="text-[#8E8E8E]">
          <MoreVertical size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'u1';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                isMe 
                ? 'bg-[#E65C4F] text-white rounded-tr-none' 
                : 'bg-white text-[#2D2D2D] border border-black/5 rounded-tl-none'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <p className={`text-[8px] mt-1.5 font-bold uppercase tracking-widest ${isMe ? 'text-white/60' : 'text-[#8E8E8E]'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white border-t border-black/[0.03]">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-2 text-[#8E8E8E] hover:bg-gray-50 rounded-full transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm text-black focus:ring-1 focus:ring-[#E65C4F]/20 placeholder:text-[#8E8E8E]"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-[#E65C4F] text-white rounded-full disabled:opacity-30 active:scale-90 transition-all shadow-md"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
