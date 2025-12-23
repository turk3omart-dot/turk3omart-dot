
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { X, Sparkles, Music, MapPin, Camera, MessageSquare, Moon, Smile, Loader2, Music2, Navigation, CheckCircle2, Video, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';
import { MomentType, Moment } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ComposerProps {
  type: MomentType;
  onClose: () => void;
  onSave: (moment: Partial<Moment>) => void;
}

export const Composer: React.FC<ComposerProps> = ({ type, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'file' | null>(null);
  
  const [musicServiceConnected, setMusicServiceConnected] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<{title: string, artist: string} | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const IconMap = {
    photo: Camera,
    location: MapPin,
    music: Music,
    thought: MessageSquare,
    sleep: Moon,
    wake: Smile,
    smile: Smile,
    video: Video,
    attachment: Paperclip
  };

  const Icon = IconMap[type as keyof typeof IconMap] || MessageSquare;

  useEffect(() => {
    if (type === 'location') {
      fetchNearbyPlaces();
    }
  }, [type]);

  const fetchNearbyPlaces = async () => {
    setIsGenerating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-09-2025",
        contents: "List 5 cozy or interesting nearby cafes, parks, or landmarks near my location. Return them as a simple list with titles and brief descriptions.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          }
        },
      });

      const places = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.maps?.title || "Nearby Spot",
        uri: chunk.maps?.uri || "#",
      })) || [];

      setNearbyPlaces(places.length > 0 ? places : [
        { title: "The Local Brew Cafe", uri: "#" },
        { title: "Sunset Park", uri: "#" },
      ]);
    } catch (error) {
      console.error("Location error:", error);
      setNearbyPlaces([{ title: "Local Coffee", uri: "#" }, { title: "The Park", uri: "#" }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMediaPick = (type: 'image' | 'video' | 'file') => {
    setMediaType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setGeneratedMedia(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMagic = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      const prompt = type === 'music' 
        ? `Suggest a song title and artist that matches this vibe: "${text}".`
        : `Rewrite this personal thought to be more poetic and minimalist: "${text}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setText(response.text || text);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({
      type,
      content: text,
      mediaUrl: generatedMedia || undefined,
      location: selectedPlace || undefined,
      timestamp: new Date(),
      reactions: []
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#FDFCF9] flex flex-col animate-in slide-in-from-bottom duration-300">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-black/[0.03]">
        <button onClick={onClose} className="p-2 -ml-2 text-[#8E8E8E] hover:text-[#2D2D2D]">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-[#E65C4F]" />
          <span className="text-sm font-bold uppercase tracking-widest text-[#2D2D2D]">{type}</span>
        </div>
        <Button size="sm" onClick={handleSave} disabled={!text && !generatedMedia && !selectedPlace && type !== 'sleep'}>
          Post
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept={mediaType === 'video' ? 'video/*' : mediaType === 'image' ? 'image/*' : '*/*'}
          />

          {type === 'music' && musicServiceConnected && (
             <div className="mb-6">
                {!selectedSong ? (
                  <div className="flex flex-col gap-2">
                    {["Midnight City - M83", "Solar Power - Lorde"].map(s => (
                      <button 
                        key={s}
                        onClick={() => setSelectedSong({title: s.split(' - ')[0], artist: s.split(' - ')[1]})}
                        className="text-left p-3 rounded-xl border border-black/5 bg-white text-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E65C4F]/30 shadow-sm">
                    <span className="text-sm font-bold">{selectedSong.title}</span>
                    <button onClick={() => setSelectedSong(null)}><X size={14}/></button>
                  </div>
                )}
             </div>
          )}

          {type === 'location' && (
            <div className="mb-6 space-y-2">
              {nearbyPlaces.map((place, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPlace(place.title)}
                  className={`w-full text-left p-3 rounded-xl border text-sm ${selectedPlace === place.title ? 'border-[#E65C4F] bg-red-50' : 'border-black/5 bg-white'}`}
                >
                  {place.title}
                </button>
              ))}
            </div>
          )}

          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={type === 'photo' ? 'Add a caption...' : 'Write something beautiful...'}
            className="w-full bg-transparent border-none focus:ring-0 text-2xl serif text-black placeholder:text-gray-300 resize-none min-h-[150px]"
          />

          {generatedMedia && (
            <div className="relative mt-4 rounded-2xl overflow-hidden shadow-md group">
              {generatedMedia.startsWith('data:video') ? (
                <video src={generatedMedia} controls className="w-full h-auto" />
              ) : generatedMedia.startsWith('data:image') ? (
                <img src={generatedMedia} alt="Selected" className="w-full h-auto" />
              ) : (
                <div className="bg-gray-100 p-8 flex flex-col items-center gap-3">
                  <FileText size={48} className="text-[#8E8E8E]" />
                  <span className="text-xs font-bold text-[#2D2D2D]">Document Attached</span>
                </div>
              )}
              <button 
                onClick={() => setGeneratedMedia(null)}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-black/[0.03] bg-white flex items-center justify-between">
        <div className="flex gap-4">
           <button onClick={() => handleMediaPick('image')} className="text-[#8E8E8E] hover:text-[#E65C4F] flex flex-col items-center gap-1 group">
             <ImageIcon size={22} className="group-active:scale-90 transition-transform" />
             <span className="text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100">Photo</span>
           </button>
           <button onClick={() => handleMediaPick('video')} className="text-[#8E8E8E] hover:text-[#E65C4F] flex flex-col items-center gap-1 group">
             <Video size={22} className="group-active:scale-90 transition-transform" />
             <span className="text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100">Video</span>
           </button>
           <button onClick={() => handleMediaPick('file')} className="text-[#8E8E8E] hover:text-[#E65C4F] flex flex-col items-center gap-1 group">
             <Paperclip size={22} className="group-active:scale-90 transition-transform" />
             <span className="text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100">File</span>
           </button>
        </div>
        
        <button
          onClick={handleMagic}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-[#FDFCF9] border border-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-[#2D2D2D] hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
        >
          {isGenerating ? (
            <Loader2 size={16} className="animate-spin text-[#E65C4F]" />
          ) : (
            <Sparkles size={16} className="text-[#E65C4F]" />
          )}
          <span>Magic Refine</span>
        </button>
      </div>
    </div>
  );
};
