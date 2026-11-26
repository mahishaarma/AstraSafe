import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Mountain, Users } from 'lucide-react';
import logoImg from '../assets/images/astrasafe_logo_1787574001308.jpg';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onEnter}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#F4F1EA] dark:bg-[#101711] text-[#2C362B] dark:text-[#EAEFE9] cursor-pointer selection:bg-[#5A6D56] selection:text-white overflow-y-auto transition-colors duration-300"
    >
      {/* Top subtle badge */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5DA] dark:bg-[#1B251D] text-[#5A6D56] dark:text-[#88B084] text-xs font-bold border border-[#5A6D56]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Himalayan Women Safety Network</span>
        </div>
        <div className="text-xs font-semibold text-[#7A7A7A] dark:text-[#8D9F90]">
          Verified Solo Travel Portal
        </div>
      </div>

      {/* Center Hero: Exact Original Logo and Direct Login Action */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-6 max-w-xl">
        
        {/* Main Logo Container displaying the exact complete untouched logo artwork */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group mb-6 transition-transform duration-300 transform hover:scale-102"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-4 bg-[#5A6D56]/10 dark:bg-[#88B084]/15 rounded-3xl blur-2xl group-hover:bg-[#5A6D56]/20 transition-all duration-500 pointer-events-none" />

          {/* Exact Logo Artwork (No cropping, full image preserved as given) */}
          <div className="relative w-64 sm:w-80 md:w-96 rounded-2xl overflow-hidden shadow-xl border border-[#5A6D56]/20 dark:border-[#88B084]/30 bg-[#FAF8F5] dark:bg-[#18221A] p-2">
            <img
              src={logoImg}
              alt="AstraSafe — Safe Journeys. Stronger Women."
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Descriptor */}
        <p className="text-sm sm:text-base text-[#555] dark:text-[#CBD5CB] max-w-md mx-auto leading-relaxed mb-6">
          The safety-first travel intelligence and peer connection network exclusively verified for solo women exploring the Himalayas.
        </p>

        {/* Primary Interactive Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
          className="px-8 py-4 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] dark:bg-[#5A6D56] dark:hover:bg-[#435340] text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Begin Safe Journey & Login</span>
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>

        <p className="text-xs text-[#8A8A8A] dark:text-[#7A8A7C] mt-3">
          Click anywhere on screen to continue
        </p>
      </div>

      {/* Bottom Feature Badges */}
      <div className="w-full max-w-3xl border-t border-[#E5E0D5] dark:border-[#243026] pt-4 pb-2">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-[#555] dark:text-[#CBD5CB]">
            <ShieldCheck className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] shrink-0" />
            <span className="font-semibold">100% Female Verified</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-[#555] dark:text-[#CBD5CB]">
            <Mountain className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] shrink-0" />
            <span className="font-semibold">Himalayan SOS Grid</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-[#555] dark:text-[#CBD5CB]">
            <Users className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] shrink-0" />
            <span className="font-semibold">Vetted Buddy Radar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
