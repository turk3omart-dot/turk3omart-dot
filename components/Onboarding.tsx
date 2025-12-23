
import React, { useState } from 'react';
import { Button } from './Button';
import { Heart, Shield, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Users size={48} className="text-[#E65C4F]" />,
      title: "Keep your moments close.",
      description: "Origin is a private journal for you and your inner circle. No influencers, no noise—just the people who actually matter."
    },
    {
      icon: <Heart size={48} className="text-[#9EB384]" />,
      title: "Share moments.",
      description: "Whether it's a song you're loving, a quiet walk, or a quick thought, every moment builds your personal timeline."
    },
    {
      icon: <Shield size={48} className="text-[#C5A059]" />,
      title: "Private by design.",
      description: "You decide exactly who sees your life. 50 friends max. Real connections, not counts."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#FDFCF9] px-8 pt-24 pb-12 text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8 p-6 bg-white rounded-[2rem] shadow-sm">
          {steps[step].icon}
        </div>
        <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4">{steps[step].title}</h2>
        <p className="serif text-[#8E8E8E] leading-relaxed max-w-xs">
          {steps[step].description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-[#E65C4F]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        {step < steps.length - 1 ? (
          <Button size="lg" onClick={() => setStep(step + 1)}>
            Continue
          </Button>
        ) : (
          <Button size="lg" onClick={onComplete}>
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};
