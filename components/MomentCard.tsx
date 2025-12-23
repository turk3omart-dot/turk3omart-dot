
import React, { useState } from 'react';
import { Moment, Comment } from '../types';
import { Camera, MapPin, Music, MessageSquare, Moon, Sun, Heart, Send } from 'lucide-react';
import { REACTION_CONFIG } from '../constants';

interface MomentCardProps {
  moment: Moment;
  onReact: (momentId: string, type: string) => void;
  onAddComment: (momentId: string, text: string) => void;
}

export const MomentCard: React.FC<MomentCardProps> = ({ moment, onReact, onAddComment }) => {
  const [showReactionDrawer, setShowReactionDrawer] = useState(false);
  const [commentText, setCommentText] = useState('');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const IconMap = {
    photo: Camera,
    location: MapPin,
    music: Music,
    thought: MessageSquare,
    sleep: Moon,
    wake: Sun
  };

  const Icon = IconMap[moment.type as keyof typeof IconMap] || MessageSquare;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(moment.id, commentText);
    setCommentText('');
  };

  return (
    <div className="relative pl-10 mb-10 group">
      {/* Timeline Thread */}
      <div className="absolute left-4 top-2 bottom-[-40px] w-0.5 bg-gray-100 group-last:bg-transparent"></div>
      
      {/* Time Dot */}
      <div className="absolute left-3 top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#E65C4F] z-10"></div>

      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <img 
            src={moment.userAvatar} 
            alt={moment.userName} 
            className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#2D2D2D]">{moment.userName}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8E8E8E] font-medium uppercase tracking-wider">
              <Icon size={12} className="text-[#E65C4F]" />
              <span>{moment.type}</span>
              <span>•</span>
              <span>{formatTime(new Date(moment.timestamp))}</span>
              {moment.location && (
                <>
                  <span>•</span>
                  <span>{moment.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 overflow-hidden transition-colors">
          <p className="text-[#2D2D2D] text-sm leading-relaxed serif mb-3 whitespace-pre-wrap">
            {moment.content}
          </p>
          
          {moment.mediaUrl && (
            <div className="mt-2 rounded-xl overflow-hidden mb-3">
              <img 
                src={moment.mediaUrl} 
                alt="Moment" 
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Custom Reactions Section */}
          <div className="relative flex flex-wrap items-center gap-2 min-h-[28px] mb-4">
            {moment.reactions.length > 0 && moment.reactions.map((reaction, i) => {
              const config = REACTION_CONFIG[reaction.type] || REACTION_CONFIG.love;
              const ReactIcon = config.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/[0.03] animate-in zoom-in-95 duration-200"
                  style={{ backgroundColor: `${config.color}08`, borderColor: `${config.color}20` }}
                >
                  <ReactIcon size={12} color={config.color} fill={config.color} fillOpacity={0.15} />
                  <span className="text-[10px] font-bold" style={{ color: config.color }}>{reaction.count}</span>
                </div>
              );
            })}

            <div className="relative">
              <button 
                onClick={() => setShowReactionDrawer(!showReactionDrawer)}
                className={`flex items-center gap-1.5 transition-colors p-1.5 -m-1.5 rounded-lg ${
                  showReactionDrawer ? 'text-[#E65C4F] bg-red-50' : 'text-[#8E8E8E] hover:text-[#E65C4F]'
                }`}
              >
                <Heart size={14} fill={moment.reactions.length > 0 ? "currentColor" : "none"} fillOpacity={0.2} />
                <span className="text-xs font-bold uppercase tracking-wider">React</span>
              </button>

              {showReactionDrawer && (
                <div className="absolute left-0 bottom-8 z-20 bg-white/95 backdrop-blur-md shadow-2xl border border-black/5 rounded-2xl p-2 flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                  {Object.entries(REACTION_CONFIG).map(([key, config]) => {
                    const ReactIcon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onReact(moment.id, key);
                          setShowReactionDrawer(false);
                        }}
                        className="group flex flex-col items-center gap-1 p-2 hover:bg-black/5 rounded-xl transition-all active:scale-90"
                      >
                        <ReactIcon size={20} color={config.color} fill={config.color} fillOpacity={0.1} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter" style={{ color: config.color }}>{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-black/[0.03] pt-3 mt-1">
            <div className="space-y-3 mb-4">
              {moment.comments?.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-1">
                  <img src={comment.userAvatar} className="w-5 h-5 rounded-full mt-0.5 object-cover" alt={comment.userName} />
                  <div className="bg-gray-50/80 rounded-2xl px-3 py-2 max-w-[85%]">
                    <p className="text-[10px] font-bold text-[#2D2D2D] leading-none mb-1">{comment.userName}</p>
                    <p className="text-xs text-[#2D2D2D] leading-normal serif">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="relative flex items-center">
              <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a thought..."
                className="w-full bg-gray-50/50 border border-black/5 rounded-full px-4 py-2 text-xs text-black focus:ring-1 focus:ring-[#E65C4F]/20 focus:bg-white placeholder:text-[#8E8E8E] transition-all"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-1 p-1.5 text-[#E65C4F] disabled:opacity-30 transition-all hover:scale-110 active:scale-95"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
      {showReactionDrawer && (
        <div className="fixed inset-0 z-10" onClick={() => setShowReactionDrawer(false)} />
      )}
    </div>
  );
};
