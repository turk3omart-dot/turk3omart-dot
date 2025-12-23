
import React, { useState } from 'react';
import { Plus, Camera, Moon, Music, MapPin, Smile, MessageSquare } from 'lucide-react';

interface MomentMenuProps {
  onSelect: (type: string) => void;
}

export const MomentMenu: React.FC<MomentMenuProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'music', icon: Music, label: 'Share Music', color: '#B190B6' },
    { id: 'location', icon: MapPin, label: 'Check In', color: '#9EB384' },
    { id: 'thought', icon: MessageSquare, label: 'Post a Thought', color: '#7FB3D5' },
    { id: 'photo', icon: Camera, label: 'Take Photo', color: '#E59866' },
    { id: 'sleep', icon: Moon, label: 'Go to Sleep', color: '#2E4053' },
    { id: 'smile', icon: Smile, label: 'Status Update', color: '#F4D03F' },
  ];

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Background Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#FDFCF9]/90 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Fan Items */}
      {menuItems.map((item, index) => {
        const angle = -90 + (index * 15);
        const radius = 110;
        const x = isOpen ? radius * Math.cos((angle * Math.PI) / 180) : 0;
        const y = isOpen ? radius * Math.sin((angle * Math.PI) / 180) : 0;

        return (
          <div
            key={item.id}
            className="absolute transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
            style={{
              transform: `translate(${x + 40}px, ${y - 40}px)`,
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transitionDelay: `${index * 30}ms`
            }}
          >
            <div className="relative group flex items-center">
              <button
                onClick={() => {
                  onSelect(item.id);
                  setIsOpen(false);
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full text-white shadow-xl hover:scale-110 active:scale-90 transition-transform"
                style={{ backgroundColor: item.color }}
              >
                <item.icon size={20} strokeWidth={2.5} />
              </button>
              
              {/* Labels - appear on hover (web) and persistent when open (mobile feel) */}
              <span className={`absolute left-16 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl border border-black/5 text-[10px] font-bold uppercase tracking-widest text-[#2D2D2D] whitespace-nowrap shadow-sm transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                {item.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-10 w-16 h-16 rounded-full bg-[#E65C4F] text-white flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <Plus size={36} strokeWidth={2.5} />
      </button>
    </div>
  );
};
