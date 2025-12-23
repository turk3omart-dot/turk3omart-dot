
import React from 'react';
import { ChevronLeft, Bell, Heart, MessageCircle, UserPlus, Cake } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsProps {
  onBack: () => void;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'reaction',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://picsum.photos/seed/sarah/200/200',
    content: 'loved your photo.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    targetId: 'm1'
  },
  {
    id: 'n2',
    type: 'comment',
    userId: 'u3',
    userName: 'Marcus Thorne',
    userAvatar: 'https://picsum.photos/seed/marcus/200/200',
    content: 'commented: "Incredible view! Wish I was there."',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    read: true,
    targetId: 'm1'
  },
  {
    id: 'n3',
    type: 'friend_request',
    userId: 'u4',
    userName: 'Emily Chen',
    userAvatar: 'https://picsum.photos/seed/emily/200/200',
    content: 'wants to join your circle.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true
  }
];

export const Notifications: React.FC<NotificationsProps> = ({ onBack }) => {
  const getIcon = (type: AppNotification['type']) => {
    switch(type) {
      case 'reaction': return <Heart size={14} className="text-[#E65C4F] fill-[#E65C4F]/20" />;
      case 'comment': return <MessageCircle size={14} className="text-blue-400" />;
      case 'friend_request': return <UserPlus size={14} className="text-green-500" />;
      case 'birthday': return <Cake size={14} className="text-purple-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFCF9]">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between bg-white border-b border-black/[0.03]">
        <button onClick={onBack} className="p-2 -ml-2 text-[#8E8E8E] hover:text-[#2D2D2D]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-[#2D2D2D]">Notifications</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id} 
            className={`flex items-start gap-4 p-6 border-b border-black/[0.02] transition-colors ${notif.read ? 'bg-transparent' : 'bg-[#E65C4F]/5'}`}
          >
            <div className="relative">
              <img src={notif.userAvatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-black/5">
                {getIcon(notif.type)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#2D2D2D]">
                <span className="font-bold">{notif.userName}</span> {notif.content}
              </p>
              <p className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider mt-1">
                {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!notif.read && <div className="w-1.5 h-1.5 bg-[#E65C4F] rounded-full mt-2"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
