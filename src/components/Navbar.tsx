import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Compass,
  Users,
  FileText,
  Bot,
  MessageSquare,
  Map,
  Car,
  PhoneCall,
  PhoneForwarded,
  Calendar,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  MapPin
} from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AstraSafeLogo } from './AstraSafeLogo';

interface NavbarProps {
  user: UserProfile;
  activeTab: 'radar' | 'cabs' | 'plans' | 'guides' | 'checkin' | 'ai' | 'community';
  setActiveTab: (tab: 'radar' | 'cabs' | 'plans' | 'guides' | 'checkin' | 'ai' | 'community') => void;
  selectedDestinationId: string;
  setSelectedDestinationId: (id: string) => void;
  destinations: { id: string; name: string }[];
  plansCount?: number;
  onOpenIDModal: () => void;
  onOpenPrivacyModal: () => void;
  onTriggerSOS: () => void;
  onOpenOfflineMap: () => void;
  onOpenCabSafety: () => void;
  onOpenFakeCall: () => void;
  onOpenEmergencyDirectory: () => void;
  onOpenOnboarding: () => void;
  onOpenSplash?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  selectedDestinationId,
  setSelectedDestinationId,
  destinations,
  plansCount = 0,
  onOpenIDModal,
  onOpenPrivacyModal,
  onTriggerSOS,
  onOpenOfflineMap,
  onOpenCabSafety,
  onOpenFakeCall,
  onOpenEmergencyDirectory,
  onOpenOnboarding,
  onOpenSplash,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isSafetyMenuOpen, setIsSafetyMenuOpen] = useState<boolean>(false);
  const safetyMenuRef = useRef<HTMLDivElement>(null);

  // Close safety menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (safetyMenuRef.current && !safetyMenuRef.current.contains(event.target as Node)) {
        setIsSafetyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#151D16]/95 backdrop-blur-md border-b border-[#E5E0D5] dark:border-[#2C382E] text-[#2C362B] dark:text-[#EAEFE9] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP BRAND & CONTROLS ROW */}
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* BRAND ZONE: Distinctive AstraSafe emblem + brand title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSplash}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
              title="AstraSafe - Safe Journeys. Stronger Women. (Click to view Welcome Splash)"
            >
              <AstraSafeLogo size="sm" showWordmark={false} />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#2C362B] dark:text-[#FFFFFF] group-hover:text-[#5A6D56] dark:group-hover:text-[#88B084] transition-colors">
                    Astra<span className="text-[#5A6D56] dark:text-[#88B084]">Safe</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] border border-[#5A6D56]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Solo Safety
                  </span>
                </div>
                <span className="text-[11px] text-[#7A7A7A] dark:text-[#9DAFA0] font-medium hidden sm:block">
                  Safe Journeys. Stronger Women.
                </span>
              </div>
            </button>
          </div>

          {/* DESTINATION REGION SELECTOR */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-[#1F2921] border border-[#E5E0D5] dark:border-[#2C382E] rounded-full px-3 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A] dark:text-[#9DAFA0]">
              Region:
            </span>
            <select
              id="destination-select"
              aria-label="Select destination"
              value={selectedDestinationId}
              onChange={(e) => setSelectedDestinationId(e.target.value)}
              className="bg-transparent text-[#2C362B] dark:text-[#EAEFE9] font-bold focus:outline-none cursor-pointer pr-1"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id} className="bg-white dark:bg-[#1B241D] text-[#2C362B] dark:text-[#EAEFE9]">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* RIGHT ACTION ZONE (Organised, Uncluttered, Functional) */}
          <div className="flex items-center gap-2">
            
            {/* Quick Safety Kit Dropdown (Consolidates Emergency tools so navbar is clean) */}
            <div className="relative" ref={safetyMenuRef}>
              <button
                type="button"
                onClick={() => setIsSafetyMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF8F5] dark:bg-[#1F2921] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E] transition cursor-pointer shadow-xs"
                title="Quick Safety & Escape Tools"
              >
                <Shield className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084]" />
                <span className="hidden sm:inline">Safety Kit</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isSafetyMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setIsSafetyMenuOpen(false);
                      onOpenEmergencyDirectory();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#2C362B] dark:text-[#EAEFE9] transition"
                  >
                    <PhoneForwarded className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <div>
                      <div className="font-bold text-rose-700 dark:text-rose-300">24/7 Helplines Directory</div>
                      <div className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0]">Police 1091 & Rescue</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsSafetyMenuOpen(false);
                      onOpenFakeCall();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F0F4EF] dark:hover:bg-[#253327] text-[#2C362B] dark:text-[#EAEFE9] transition"
                  >
                    <PhoneCall className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                    <div>
                      <div className="font-bold">Fake Call Escape</div>
                      <div className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0]">Trigger instant call</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsSafetyMenuOpen(false);
                      onOpenOfflineMap();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F0F4EF] dark:hover:bg-[#253327] text-[#2C362B] dark:text-[#EAEFE9] transition"
                  >
                    <Map className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                    <div>
                      <div className="font-bold">Offline Mountain Map</div>
                      <div className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0]">Zero network GPS shelters</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsSafetyMenuOpen(false);
                      setActiveTab('cabs');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-amber-50 dark:hover:bg-amber-950/30 text-[#2C362B] dark:text-[#EAEFE9] transition"
                  >
                    <Car className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-bold text-amber-700 dark:text-amber-400">Cab Guard & Child Lock</div>
                      <div className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0]">Pre-ride lock inspection</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Profile & Privacy Button */}
            <button
              onClick={onOpenPrivacyModal}
              id="privacy-controls-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF8F5] dark:bg-[#1F2921] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E] transition cursor-pointer"
              title="Manage profile visibility and privacy controls"
            >
              <Lock className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084]" />
              <span className="hidden md:inline">Privacy</span>
            </button>

            {/* Female Sign-In / Explorer Profile Pill */}
            <button
              onClick={onOpenOnboarding}
              id="female-signin-onboarding-btn"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] border border-[#5A6D56]/40 hover:bg-[#E2EBE0] dark:hover:bg-[#2F4031] transition cursor-pointer shadow-xs"
              title="Click to edit verification & profile login details"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover border border-white dark:border-[#151D16]"
              />
              <span className="max-w-[80px] sm:max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084] shrink-0" />
            </button>

            {/* THEME TOGGLE (LIGHT / DARK SWITCH BUTTON) */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              className="p-2 rounded-full bg-[#FAF8F5] dark:bg-[#1F2921] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E] transition cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle dark and light theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-[#5A6D56] animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* EMERGENCY SOS TRIGGER */}
            <button
              onClick={onTriggerSOS}
              id="sos-trigger-btn"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-sm transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS</span>
            </button>

          </div>
        </div>

        {/* ORGANIZED NAVIGATION TABS ROW */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 border-t border-[#E5E0D5] dark:border-[#2C382E] no-scrollbar">
          
          {/* TAB 1: Safety Radar */}
          <button
            id="tab-radar"
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF] dark:hover:bg-[#1F2921]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Safety Radar & Map</span>
          </button>

          {/* TAB 2: Book Safe Cab & Guard (Dedicated Feature) */}
          <button
            id="tab-cabs"
            onClick={() => setActiveTab('cabs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              activeTab === 'cabs'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF] dark:hover:bg-[#1F2921]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Book Safe Cab & Guard</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
              activeTab === 'cabs' ? 'bg-white/20 text-white' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
            }`}>
              Vetted
            </span>
          </button>

          {/* TAB 3: Free Day & Plans */}
          <button
            id="tab-plans"
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF] dark:hover:bg-[#1F2921]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Free Day & Plans</span>
            {plansCount > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'plans' ? 'bg-white/20 text-white' : 'bg-[#5A6D56]/15 text-[#5A6D56] dark:text-[#88B084]'
              }`}>
                {plansCount}
              </span>
            )}
          </button>

          {/* TAB 4: Guides & Peers */}
          <button
            id="tab-guides"
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              activeTab === 'guides'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF] dark:hover:bg-[#1F2921]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Guides & Peers</span>
          </button>

          {/* TAB 5: Tourist Check-In */}
          <button
            id="tab-checkin"
            onClick={() => setActiveTab('checkin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              activeTab === 'checkin'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF] dark:hover:bg-[#1F2921]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Govt Check-In</span>
          </button>

          {/* TAB 6: AI Companion */}
          <button
            id="tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF] dark:hover:bg-[#1F2921]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Safety Companion</span>
          </button>

          {/* TAB 7: Live Community */}
          <button
            id="tab-community"
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
              activeTab === 'community'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF] dark:hover:bg-[#1F2921]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Feed</span>
          </button>

        </div>

      </div>
    </header>
  );
};
