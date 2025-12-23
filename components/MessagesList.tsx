
import React from 'react';
import { ChevronLeft, Edit3, Search } from 'lucide-react';
import { Conversation } from '../types';

interface MessagesListProps {
  onBack: () => void;
  onSelectConversation: (conv: Conversation) => void;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participant: { id: 'u2', name: 'Sarah Jenkins', avatar: 'https://picsum.photos/seed/sarah/200/200' },
    lastMessage: 'That photo you posted from the valley was incredible!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: true
  },
  {
    id: 'c2',
    participant: { id: 'u3', name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/marcus/200/200' },
    lastMessage: 'Let\'s catch up soon. Maybe coffee next week?',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    unread: false
  }
];

export const MessagesList: React.FC<MessagesListProps> = ({ onBack, onSelectConversation }) => {
  return (
    <div className="flex flex-col h-full bg-[#FDFCF9]">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between bg-white border-b border-black/[0.03]">
        <button onClick={onBack} className="p-2 -ml-2 text-[#8E8E8E] hover:text-[#2D2D2D]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-[#2D2D2D]">Messages</h1>
        <button className="p-2 -mr-2 text-[#E65C4F] hover:text-[#d44b3e]">
          <Edit3 size={20} />
        </button>
      </header>

      <div className="px-6 py-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" size={16} />
          <input 
            type="text" 
            placeholder="Search conversations"
            className="w-full bg-gray-50 border border-black/5 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#E65C4F]/20"
          />
        </div>

        <div className="space-y-4">
          {MOCK_CONVERSATIONS.map((conv) => (
            <button 
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-sm active:scale-[0.98] transition-all text-left relative"
            >
              <img src={conv.participant.avatar} className="w-12 h-12 rounded-full border border-black/5" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-[#2D2D2D] text-sm">{conv.participant.name}</span>
                  <span className="text-[10px] text-[#8E8E8E]">
                    {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-xs truncate ${conv.unread ? 'font-bold text-[#2D2D2D]' : 'text-[#8E8E8E]'}`}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread && (
                <div className="w-2 h-2 bg-[#E65C4F] rounded-full absolute top-4 right-4 shadow-sm"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
