
import React, { useState } from 'react';
import { Button } from './Button';
import { User, Mail, Phone, Calendar, UserCheck, X, Shield, ScrollText } from 'lucide-react';

interface RegistrationProps {
  onComplete: (data: any) => void;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF9] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-black/[0.03]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#2D2D2D] flex items-center gap-2">
            {title === 'Terms of Service' ? <ScrollText size={16} className="text-[#E65C4F]" /> : <Shield size={16} className="text-[#E65C4F]" />}
            {title}
          </h3>
          <button onClick={onClose} className="p-2 -mr-2 text-[#8E8E8E] hover:text-[#2D2D2D]">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar serif italic text-sm text-[#2D2D2D] leading-relaxed space-y-4">
          {children}
        </div>
        <div className="p-6 bg-white border-t border-black/[0.03]">
          <Button onClick={onClose} className="w-full">Understood</Button>
        </div>
      </div>
    </div>
  );
};

export const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) onComplete(formData);
  };

  const isFormValid = formData.name && formData.email && formData.phone && formData.dob && agreed;

  return (
    <div className="flex flex-col h-full bg-[#FDFCF9] px-8 pt-20 pb-12">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-[#2D2D2D] mb-2 tracking-tight">Create your account</h2>
        <p className="serif text-[#8E8E8E] text-sm italic">Tell us a bit about yourself to join the circle.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E65C4F]">
              <User size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Full Name"
              required
              className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#E65C4F]/20 focus:border-[#E65C4F] outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E65C4F]">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Email Address"
              required
              className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#E65C4F]/20 focus:border-[#E65C4F] outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E65C4F]">
              <Phone size={18} />
            </div>
            <input 
              type="tel" 
              placeholder="Phone Number"
              required
              className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#E65C4F]/20 focus:border-[#E65C4F] outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E65C4F]">
              <Calendar size={18} />
            </div>
            <input 
              type="date" 
              placeholder="Date of Birth"
              required
              className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#E65C4F]/20 focus:border-[#E65C4F] outline-none transition-all"
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
            />
          </div>

          <div className="pt-4 flex items-start gap-3">
            <div className="relative flex items-center justify-center mt-1">
              <input 
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 appearance-none border-2 border-black/10 rounded-lg checked:bg-[#E65C4F] checked:border-[#E65C4F] transition-all cursor-pointer"
              />
              {agreed && (
                <div className="absolute pointer-events-none text-white">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              )}
            </div>
            <label htmlFor="terms" className="text-xs text-[#8E8E8E] leading-tight select-none">
              I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-[#E65C4F] font-bold underline underline-offset-2">Terms of Service</button> and have read the <button type="button" onClick={() => setShowPrivacy(true)} className="text-[#E65C4F] font-bold underline underline-offset-2">Privacy Policy</button>.
            </label>
          </div>
        </div>

        <div className="pt-8">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14" 
            disabled={!isFormValid}
          >
            <div className="flex items-center gap-2">
              <UserCheck size={20} />
              <span>Join Origin</span>
            </div>
          </Button>
          <p className="mt-4 text-[10px] text-center text-[#8E8E8E] px-4">
            By joining, you agree to share your life's best moments with your inner circle.
          </p>
        </div>
      </form>

      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <p>Welcome to Origin. By using our service, you agree to these terms:</p>
        <p>1. <strong>Intimate Connections:</strong> Origin is designed for high-quality, personal interactions. Users are encouraged to maintain small, active circles of real-life friends.</p>
        <p>2. <strong>User Conduct:</strong> You are responsible for the content you post. Harassment, hate speech, or sharing non-consensual imagery is strictly prohibited and will result in immediate account termination.</p>
        <p>3. <strong>Content Ownership:</strong> You own the rights to the photos and thoughts you post. However, you grant Origin a limited license to host and display your content to your selected circle.</p>
        <p>4. <strong>Account Limits:</strong> To preserve the quality of the network, each user is limited to a "Circle" of 50 friends. Automated or "bot" accounts are not permitted.</p>
        <p>5. <strong>Termination:</strong> We reserve the right to suspend accounts that violate the spirit of intimate, safe connection that Origin represents.</p>
      </Modal>

      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <p>Your privacy is the core of Origin. Here is how we handle your data:</p>
        <p>1. <strong>Data Minimization:</strong> We only collect the data necessary to provide our service: your name, email, phone number, and date of birth for account verification.</p>
        <p>2. <strong>Your Moments:</strong> Your moments (thoughts, photos, music, location) are only shared with the people in your "Inner Circle." They are never sold to advertisers or third-party data brokers.</p>
        <p>3. <strong>Location Data:</strong> When you share a "Check In," we use your GPS coordinates to find nearby places via the Google Maps API. This location data is only stored for that specific post and is not tracked in the background.</p>
        <p>4. <strong>Encryption:</strong> All personal data is encrypted in transit and at rest using industry-standard protocols.</p>
        <p>5. <strong>Control:</strong> You can delete your account and all associated data at any time through the settings menu. Deletion is permanent and irreversible.</p>
      </Modal>
    </div>
  );
};
