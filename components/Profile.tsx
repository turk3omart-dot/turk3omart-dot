
import React, { useState } from 'react';
import { MOCK_USER, COLORS } from '../constants';
import { Calendar, Users, Activity, Settings, ChevronLeft, Edit2, LayoutGrid, List } from 'lucide-react';
import { Button } from './Button';
import { User, Moment } from '../types';
import { MomentCard } from './MomentCard';

interface ProfileProps {
  onBack: () => void;
  onEdit: () => void;
  user: User;
  moments: Moment[];
  onReact: (id: string, type: string) => void;
  onComment: (id: string, text: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack, onEdit, user, moments, onReact, onComment }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'media'>('timeline');
  const userMoments = moments.filter(m => m.userId === user.id);
  const mediaMoments = userMoments.filter(m => m.mediaUrl);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF9]">
      {/* Hero Header */}
      <div className="relative h-64 bg-[#E65C4F] flex items-end px-6 pb-6 overflow-hidden">
        {user.coverPhoto && (
          <img 
            src={user.coverPhoto} 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
            alt="Cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-10 left-6 p-2 rounded-full bg-white/20 text-white active:bg-white/30 transition-all z-10"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={onEdit}
          className="absolute top-10 right-6 p-2 rounded-full bg-white/20 text-white active:bg-white/30 transition-all z-10"
        >
          <Edit2 size={20} />
        </button>

        <div className="relative z-10 flex items-center gap-4">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <div className="text-white">
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-white/80 text-sm font-medium italic serif">Your private space</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-6 py-8">
          <p className="serif text-lg text-[#2D2D2D] mb-8 leading-relaxed italic">
            "{user.bio}"
          </p>

          <div className="flex items-center gap-6 mb-8 border-b border-black/[0.03]">
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'timeline' ? 'text-[#E65C4F]' : 'text-[#8E8E8E]'
              }`}
            >
              Timeline
              {activeTab === 'timeline' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E65C4F]" />}
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'media' ? 'text-[#E65C4F]' : 'text-[#8E8E8E]'
              }`}
            >
              Media ({mediaMoments.length})
              {activeTab === 'media' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E65C4F]" />}
            </button>
          </div>

          {activeTab === 'timeline' ? (
            <div className="space-y-2">
              {userMoments.length > 0 ? userMoments.map(m => (
                <MomentCard key={m.id} moment={m} onReact={onReact} onAddComment={onComment} />
              )) : (
                <div className="py-12 text-center">
                  <p className="serif italic text-[#8E8E8E]">No moments shared yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {mediaMoments.length > 0 ? mediaMoments.map(m => (
                <div key={m.id} className="aspect-square rounded-2xl overflow-hidden border border-black/5 shadow-sm">
                  <img src={m.mediaUrl} className="w-full h-full object-cover" alt="Moment" />
                </div>
              )) : (
                <div className="col-span-2 py-12 text-center">
                  <p className="serif italic text-[#8E8E8E]">No media shared yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
