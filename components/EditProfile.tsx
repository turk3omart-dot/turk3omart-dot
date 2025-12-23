
import React, { useState, useRef } from 'react';
import { User, X, Camera, Image as ImageIcon, Sparkles, Loader2, Save, User as UserIcon, Type, RefreshCcw } from 'lucide-react';
import { Button } from './Button';
import { User as UserType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface EditProfileProps {
  user: UserType;
  onClose: () => void;
  onSave: (updatedUser: UserType) => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserType>({ ...user });
  const [isGenerating, setIsGenerating] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleMagicBio = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this bio to be more poetic, nostalgic, and intimate for a private social journal called Origin. Keep it under 15 words: "${formData.bio}"`,
      });
      setFormData({ ...formData, bio: response.text?.replace(/"/g, '').trim() || formData.bio });
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, [type]: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomPhoto = (type: 'avatar' | 'coverPhoto') => {
    const seeds = ['forest', 'ocean', 'sky', 'minimal', 'portrait', 'aesthetic'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)] + Math.random();
    const newUrl = type === 'avatar' 
      ? `https://picsum.photos/seed/${randomSeed}/400/400`
      : `https://picsum.photos/seed/${randomSeed}/1200/800`;
    
    setFormData({ ...formData, [type]: newUrl });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#FDFCF9] flex flex-col animate-in slide-in-from-bottom duration-300">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/[0.03] bg-white">
        <button onClick={onClose} className="p-2 -ml-2 text-[#8E8E8E] hover:text-[#2D2D2D]">
          <X size={24} />
        </button>
        <span className="text-sm font-bold uppercase tracking-widest text-[#2D2D2D]">Edit Profile</span>
        <Button size="sm" onClick={() => onSave(formData)}>
          <div className="flex items-center gap-2">
            <Save size={16} />
            <span>Save</span>
          </div>
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Visual Preview */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <img 
            src={formData.coverPhoto} 
            className="w-full h-full object-cover" 
            alt="Cover Preview"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 hover:bg-white/40 transition-all flex flex-col items-center gap-1"
            >
              <ImageIcon size={20} />
              <span className="text-[10px] font-bold uppercase">Library</span>
            </button>
            <button 
              onClick={() => generateRandomPhoto('coverPhoto')}
              className="bg-black/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 hover:bg-black/40 transition-all flex flex-col items-center gap-1"
            >
              <RefreshCcw size={20} />
              <span className="text-[10px] font-bold uppercase">Random</span>
            </button>
          </div>
          <input 
            type="file" 
            ref={coverInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'coverPhoto')} 
          />
        </div>

        <div className="px-6 relative">
          <div className="relative -mt-12 mb-6 group inline-block">
            <img 
              src={formData.avatar} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" 
              alt="Avatar Preview"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity gap-2">
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="hover:scale-110 transition-transform"
              >
                <Camera size={20} />
              </button>
              <button 
                onClick={() => generateRandomPhoto('avatar')}
                className="hover:scale-110 transition-transform"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
          <input 
            type="file" 
            ref={avatarInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'avatar')} 
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest ml-1">Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E65C4F]" size={18} />
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-black focus:ring-2 focus:ring-[#E65C4F]/20 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest">About You</label>
                <button 
                  onClick={handleMagicBio}
                  disabled={isGenerating || !formData.bio}
                  className="flex items-center gap-1.5 text-[#E65C4F] text-[10px] font-bold uppercase hover:opacity-70 disabled:opacity-30 transition-all"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>Magic Refine</span>
                </button>
              </div>
              <div className="relative">
                <Type className="absolute left-4 top-4 text-[#E65C4F]" size={18} />
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-black focus:ring-2 focus:ring-[#E65C4F]/20 outline-none transition-all shadow-sm resize-none serif italic"
                  placeholder="Describe your vibe..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white border-t border-black/[0.03]">
        <p className="text-[10px] text-center text-[#8E8E8E] leading-relaxed">
          Your profile is only visible to your inner circle. <br/> Changes are reflected instantly for everyone.
        </p>
      </div>
    </div>
  );
};
