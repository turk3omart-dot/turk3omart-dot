
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen, Moment, MomentType, Comment, User, Conversation } from './types';
import { MOCK_MOMENTS, MOCK_USER, REACTION_CONFIG } from './constants';
import { Onboarding } from './components/Onboarding';
import { Registration } from './components/Registration';
import { MomentCard } from './components/MomentCard';
import { MomentMenu } from './components/MomentMenu';
import { Profile } from './components/Profile';
import { Composer } from './components/Composer';
import { MessagesList } from './components/MessagesList';
import { ChatView } from './components/ChatView';
import { EditProfile } from './components/EditProfile';
import { Notifications } from './components/Notifications';
import { Search, Bell, MessageCircle, Cake, RefreshCw, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- YOUR SUPABASE CONNECTION ---
const SUPABASE_URL = 'https://jdpjjljyoianxbthyjjj.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_J5zVN64e9w9JOdfCkZXD8w_qTp2QMZN';
// --------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('onboarding');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [activeComposerType, setActiveComposerType] = useState<MomentType | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
    fetchMoments();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          ...MOCK_USER,
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User'
        });
        setScreen('timeline');
      }
    } catch (e) {
      console.log("No user found yet");
    }
  };

  const fetchMoments = async () => {
    try {
      const { data, error } = await supabase
        .from('moments')
        .select('*')
        .order('timestamp', { ascending: false });

      if (data && data.length > 0) {
        // Map database fields to our app's Moment type
        const formattedMoments = data.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp),
          reactions: m.reactions || [],
          comments: m.comments || []
        }));
        setMoments(formattedMoments);
      } else {
        setMoments(MOCK_MOMENTS);
      }
    } catch (e) {
      setMoments(MOCK_MOMENTS);
    }
  };

  const handleRegistration = async (userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: 'TemporaryPassword123!', 
      options: {
        data: {
          full_name: userData.name,
          phone: userData.phone,
          dob: userData.dob
        }
      }
    });

    if (error) {
      alert("Registration failed: " + error.message);
      return;
    }

    if (data.user) {
      const newUser: User = {
        ...MOCK_USER,
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        stats: { moments: 0, friends: 0, lastActive: 'Just now' }
      };
      setCurrentUser(newUser);
      setScreen('timeline');
    }
  };

  const handleSaveMoment = async (momentData: Partial<Moment>) => {
    if (!currentUser) return;
    
    const newMomentRecord = {
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      type: momentData.type,
      content: momentData.content,
      media_url: momentData.mediaUrl,
      location: momentData.location,
      timestamp: new Date().toISOString(),
      reactions: [],
      comments: []
    };

    const { error } = await supabase.from('moments').insert([newMomentRecord]);

    if (error) {
      // If table doesn't exist yet, we still show it locally so user sees it
      const localMoment = { ...newMomentRecord, id: Math.random().toString(), timestamp: new Date() } as unknown as Moment;
      setMoments([localMoment, ...moments]);
      console.error("Database error (maybe table 'moments' isn't created?):", error.message);
    } else {
      fetchMoments();
    }
    setActiveComposerType(null);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const pos = e.currentTarget.scrollTop;
    setScrollPos(pos);
    if (pos < -60 && !isRefreshing) triggerRefresh();
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    fetchMoments().then(() => setIsRefreshing(false));
  };

  const isBirthday = () => {
    if (!currentUser?.dob) return false;
    const today = new Date();
    const birthDate = new Date(currentUser.dob);
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setScreen('profile');
  };

  const handlePostMoment = (type: string) => {
    const mType = type as MomentType;
    if (mType === 'wake') {
      handleSaveMoment({
        type: 'wake',
        content: "Just woke up. Hello world! ☀️",
      });
      return;
    }
    setActiveComposerType(mType);
  };

  const handleReact = (momentId: string, type: string) => {
    setMoments(prev => prev.map(m => {
      if (m.id !== momentId) return m;
      const config = REACTION_CONFIG[type];
      const existingReactionIndex = m.reactions.findIndex(r => r.type === type);
      const newReactions = [...m.reactions];
      if (existingReactionIndex > -1) {
        newReactions[existingReactionIndex] = {
          ...newReactions[existingReactionIndex],
          count: newReactions[existingReactionIndex].count + 1
        };
      } else {
        newReactions.push({ type, label: config.label, count: 1, userIds: [currentUser?.id || ''] });
      }
      return { ...m, reactions: newReactions };
    }));
  };

  const handleAddComment = (momentId: string, text: string) => {
    if (!currentUser) return;
    setMoments(prev => prev.map(m => {
      if (m.id !== momentId) return m;
      const newComment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        text,
        timestamp: new Date()
      };
      return { ...m, comments: [...(m.comments || []), newComment] };
    }));
  };

  if (screen === 'onboarding') return <Onboarding onComplete={() => setScreen('registration')} />;
  if (screen === 'registration') return <Registration onComplete={handleRegistration} />;

  if (screen === 'profile') return (
    <Profile 
      onBack={() => setScreen('timeline')} 
      onEdit={() => setScreen('edit-profile')}
      user={currentUser || MOCK_USER} 
      moments={moments}
      onReact={handleReact}
      onComment={handleAddComment}
    />
  );

  if (screen === 'edit-profile') return (
    <EditProfile 
      user={currentUser || MOCK_USER} 
      onClose={() => setScreen('profile')} 
      onSave={handleUpdateUser}
    />
  );

  if (screen === 'notifications') return <Notifications onBack={() => setScreen('timeline')} />;
  if (screen === 'messages') return <MessagesList onBack={() => setScreen('timeline')} onSelectConversation={(conv) => { setActiveConversation(conv); setScreen('chat'); }} />;
  if (screen === 'chat' && activeConversation) return <ChatView conversation={activeConversation} onBack={() => setScreen('messages')} />;

  const headerOpacity = Math.min(scrollPos / 200, 1);
  const profileScale = Math.max(1 - scrollPos / 1000, 0.8);
  const pullDistance = scrollPos < 0 ? Math.abs(scrollPos) : 0;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative shadow-2xl bg-[#FDFCF9] overflow-hidden">
      <header 
        className="fixed top-0 left-0 right-0 z-40 px-6 pt-12 pb-4 backdrop-blur-md border-b transition-colors duration-300"
        style={{ 
          backgroundColor: `rgba(253, 252, 249, ${headerOpacity})`,
          borderColor: `rgba(0, 0, 0, ${headerOpacity * 0.05})`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen('profile')} style={{ opacity: headerOpacity }} className="transition-opacity duration-300">
              <img src={currentUser?.avatar || MOCK_USER.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-white shadow-sm object-cover" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-tighter text-[#E65C4F]">Origin</span>
              <span className="text-sm font-semibold text-[#2D2D2D] transition-opacity duration-300" style={{ opacity: headerOpacity }}>
                {currentUser?.name || "Your Circle"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#8E8E8E]">
            <button onClick={() => setScreen('notifications')}><Bell size={22} /></button>
            <button onClick={() => setScreen('messages')}><MessageCircle size={22} /></button>
          </div>
        </div>
      </header>

      <main ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar relative pt-0">
        <div className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none transition-all" style={{ height: `${pullDistance}px`, opacity: pullDistance / 60 }}>
          <RefreshCw size={24} className={`text-[#E65C4F] ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullDistance * 2}deg)` }} />
        </div>

        <div className="relative h-80 overflow-hidden">
          <img 
            src={currentUser?.coverPhoto || MOCK_USER.coverPhoto} 
            className="w-full h-full object-cover transform"
            style={{ transform: `scale(${1 + pullDistance/500}) translateY(${scrollPos * 0.5}px)`, filter: `brightness(${1 - scrollPos/500})` }}
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FDFCF9]"></div>
          <div className="absolute bottom-10 left-6 right-6 flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white">
              <Clock size={14} />
              <span className="text-xs font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">{currentUser?.name || "Welcome Home"}</h1>
            <p className="serif text-white/90 text-sm italic">{currentUser?.bio || "Capturing life's quiet moments."}</p>
          </div>
          <div className="absolute -bottom-12 left-6 z-10" style={{ transform: `scale(${profileScale})` }}>
            <img src={currentUser?.avatar || MOCK_USER.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" alt="Avatar" />
          </div>
        </div>

        <div className="mt-16 px-6 pb-24">
          {isBirthday() && (
            <div className="mb-8 p-6 bg-gradient-to-br from-[#E65C4F] to-[#d44b3e] rounded-[2rem] text-white shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-white/20 rounded-2xl"><Cake size={28} /></div>
                <h2 className="text-xl font-bold">Happy Birthday, {currentUser?.name.split(' ')[0]}!</h2>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {moments.map((moment) => (
              <MomentCard key={moment.id} moment={moment} onReact={handleReact} onAddComment={handleAddComment} />
            ))}
          </div>
        </div>
      </main>

      {activeComposerType && <Composer type={activeComposerType} onClose={() => setActiveComposerType(null)} onSave={handleSaveMoment} />}
      {!activeComposerType && <MomentMenu onSelect={handlePostMoment} />}
    </div>
  );
};

export default App;
