import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import { IDVerificationModal } from './components/IDVerificationModal';
import { FemaleOnboardingModal } from './components/FemaleOnboardingModal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { DestinationIntelligence } from './components/DestinationIntelligence';
import { CabBookingAndGuard } from './components/CabBookingAndGuard';
import { LocalGuidesAndPeers } from './components/LocalGuidesAndPeers';
import { TouristCheckInCard } from './components/TouristCheckInCard';
import { AISafetyCompanion } from './components/AISafetyCompanion';
import { CommunityFeed } from './components/CommunityFeed';
import { TravelBuddyPlans } from './components/TravelBuddyPlans';
import { DirectChatAndCallModal } from './components/DirectChatAndCallModal';
import { SOSModal } from './components/SOSModal';
import { SafetyScoreMethodologyModal } from './components/SafetyScoreMethodologyModal';
import { OfflineMapModal } from './components/OfflineMapModal';
import { FakeCallModal } from './components/FakeCallModal';
import { CabSafetyModal } from './components/CabSafetyModal';
import { EmergencyDirectoryModal } from './components/EmergencyDirectoryModal';

import {
  CURRENT_USER,
  HIMALAYAN_DESTINATIONS,
  ALL_VERIFIED_GUIDES,
  PEER_TRAVELERS,
  INITIAL_FREE_DAY_PLANS
} from './data/mockData';
import { DestinationDossier, FreeDayPlan, PrivacySettings, SafetyAdvisory, UserProfile } from './types';

export default function App() {
  // App Navigation Flow: 'splash' -> 'login' -> 'main'
  const [appStage, setAppStage] = useState<'splash' | 'login' | 'main'>('splash');

  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<'radar' | 'cabs' | 'plans' | 'guides' | 'checkin' | 'ai' | 'community'>('radar');
  const [selectedDestId, setSelectedDestId] = useState<string>('dest_manali');
  const [destinations, setDestinations] = useState<DestinationDossier[]>(HIMALAYAN_DESTINATIONS);
  const [plans, setPlans] = useState<FreeDayPlan[]>(INITIAL_FREE_DAY_PLANS);

  // Modal Visibility States (when in 'main' stage)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isIDModalOpen, setIsIDModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState<boolean>(false);
  const [isOfflineMapModalOpen, setIsOfflineMapModalOpen] = useState<boolean>(false);
  const [isFakeCallModalOpen, setIsFakeCallModalOpen] = useState<boolean>(false);
  const [isCabSafetyModalOpen, setIsCabSafetyModalOpen] = useState<boolean>(false);
  const [isEmergencyDirectoryOpen, setIsEmergencyDirectoryOpen] = useState<boolean>(false);

  // Direct In-App Chat & Call States
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [activeChatPeer, setActiveChatPeer] = useState<{
    id: string;
    name: string;
    avatar: string;
    handle: string;
    homeCity?: string;
    trustScore: number;
    destination?: string;
    planTitle?: string;
  } | null>(null);
  const [initialCallMode, setInitialCallMode] = useState<'audio' | 'video' | null>(null);

  // Active Destination
  const activeDestination = destinations.find((d) => d.id === selectedDestId) || destinations[0];

  const handleUpdatePrivacy = (updatedPrivacy: PrivacySettings) => {
    setUser((prev) => ({
      ...prev,
      privacy: updatedPrivacy,
    }));
  };

  const handleReportAdvisory = (newAdv: SafetyAdvisory) => {
    setDestinations((prev) =>
      prev.map((dest) => {
        if (dest.id === newAdv.destinationId) {
          return {
            ...dest,
            advisories: [newAdv, ...dest.advisories],
          };
        }
        return dest;
      })
    );
  };

  const handleOpenChat = (peer: {
    id: string;
    name: string;
    avatar: string;
    handle: string;
    homeCity?: string;
    trustScore: number;
    destination?: string;
    planTitle?: string;
  }) => {
    setActiveChatPeer(peer);
    setInitialCallMode(null);
    setIsChatModalOpen(true);
  };

  const handleOpenCall = (
    peer: {
      id: string;
      name: string;
      avatar: string;
      handle: string;
      homeCity?: string;
      trustScore: number;
      destination?: string;
      planTitle?: string;
    },
    mode: 'audio' | 'video'
  ) => {
    setActiveChatPeer(peer);
    setInitialCallMode(mode);
    setIsChatModalOpen(true);
  };

  const handleOpenChatWithDriver = (driverName: string) => {
    setActiveChatPeer({
      id: 'driver_active',
      name: driverName,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      handle: '@vetted_cab_captain',
      homeCity: activeDestination.name,
      trustScore: 99,
      destination: activeDestination.name,
      planTitle: 'Active Safe Cab Ride',
    });
    setInitialCallMode(null);
    setIsChatModalOpen(true);
  };

  const handleTouristRegistrationSubmit = async (regData: any) => {
    try {
      const res = await fetch('/api/tourist-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const result = await res.json();
      
      setUser((prev) => ({
        ...prev,
        currentTrip: {
          destination: regData.destination,
          checkInDate: regData.startDate,
          checkOutDate: regData.endDate,
          registeredWithGovt: true,
          registrationId: result.registrationId,
        },
      }));

      return result;
    } catch (err) {
      console.error(err);
      return {
        registrationId: `HPT-REG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        message: 'Registered locally.',
        details: regData,
      };
    }
  };

  const handleCompleteOnboarding = (updatedProfile: UserProfile, newDestId?: string) => {
    setUser(updatedProfile);
    if (newDestId) {
      setSelectedDestId(newDestId);
    }
  };

  // STAGE 1: Splash screen on initial open
  if (appStage === 'splash') {
    return <SplashScreen onEnter={() => setAppStage('login')} />;
  }

  // STAGE 2: Login / Verification Questions flow
  if (appStage === 'login') {
    return (
      <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#121813] text-[#2C362B] dark:text-[#EAEFE9] flex items-center justify-center p-4">
        <FemaleOnboardingModal
          isOpen={true}
          onClose={() => setAppStage('main')}
          onBackToSplash={() => setAppStage('splash')}
          currentUser={user}
          onCompleteOnboarding={(updatedProfile, destId) => {
            handleCompleteOnboarding(updatedProfile, destId);
            setAppStage('main');
          }}
        />
      </div>
    );
  }

  // STAGE 3: Main Website & Interactive Dashboard
  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#121813] text-[#2C362B] dark:text-[#EAEFE9] font-sans selection:bg-[#5A6D56] selection:text-white flex flex-col transition-colors duration-200">
      
      {/* Main Top Navigation Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDestinationId={selectedDestId}
        setSelectedDestinationId={setSelectedDestId}
        destinations={destinations.map((d) => ({ id: d.id, name: d.name }))}
        plansCount={plans.length}
        onOpenIDModal={() => setIsIDModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onTriggerSOS={() => setIsSOSModalOpen(true)}
        onOpenOfflineMap={() => setIsOfflineMapModalOpen(true)}
        onOpenCabSafety={() => setActiveTab('cabs')}
        onOpenFakeCall={() => setIsFakeCallModalOpen(true)}
        onOpenEmergencyDirectory={() => setIsEmergencyDirectoryOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSplash={() => setAppStage('splash')}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* TAB 1: Safety Radar & Destination Intelligence */}
        {activeTab === 'radar' && (
          <DestinationIntelligence
            destination={activeDestination}
            onReportAdvisory={handleReportAdvisory}
            onOpenMethodologyModal={() => setIsMethodologyModalOpen(true)}
            onOpenOfflineMapModal={() => setIsOfflineMapModalOpen(true)}
            onOpenCabSafetyModal={() => setActiveTab('cabs')}
            onOpenFakeCallModal={() => setIsFakeCallModalOpen(true)}
            onOpenEmergencyDirectoryModal={() => setIsEmergencyDirectoryOpen(true)}
          />
        )}

        {/* TAB 2: Book Safe Cab & Guard (Dedicated Partner Booking & Ride Guard) */}
        {activeTab === 'cabs' && (
          <CabBookingAndGuard
            user={user}
            activeDestinationName={activeDestination.name}
            activeDestinationId={selectedDestId}
            onLaunchFakeCall={() => setIsFakeCallModalOpen(true)}
            onTriggerSOS={() => setIsSOSModalOpen(true)}
            onOpenChatWithDriver={handleOpenChatWithDriver}
          />
        )}

        {/* TAB 3: Free Day Plans & Travel Hangout Matching (Women Connect) */}
        {activeTab === 'plans' && (
          <TravelBuddyPlans
            plans={plans}
            setPlans={setPlans}
            currentUser={user}
            activeDestinationId={selectedDestId}
            activeDestinationName={activeDestination.name}
            destinations={destinations.map((d) => ({ id: d.id, name: d.name }))}
            onOpenChat={handleOpenChat}
            onOpenCall={handleOpenCall}
          />
        )}

        {/* TAB 4: Vetted Mountain Guides (Female Guides & Partnered Male Guides) & Peer Solo Travelers */}
        {activeTab === 'guides' && (
          <LocalGuidesAndPeers
            guides={ALL_VERIFIED_GUIDES}
            peers={PEER_TRAVELERS}
            activeDestinationName={activeDestination.name}
            onOpenChat={handleOpenChat}
            onOpenCall={handleOpenCall}
          />
        )}

        {/* TAB 5: Tourist Check-In & Government / Local Authority Registration */}
        {activeTab === 'checkin' && (
          <TouristCheckInCard
            user={user}
            activeDestinationName={activeDestination.name}
            onRegisterSubmit={handleTouristRegistrationSubmit}
          />
        )}

        {/* TAB 6: Gemini AI Safety Companion */}
        {activeTab === 'ai' && (
          <AISafetyCompanion currentLocationName={activeDestination.name} />
        )}

        {/* TAB 7: Live Community & Real Photo Feed */}
        {activeTab === 'community' && (
          <CommunityFeed
            user={user}
            currentLocationName={activeDestination.name}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E0D5] dark:border-[#2C382E] bg-white dark:bg-[#151D16] py-8 text-center text-xs text-[#8A8A8A] dark:text-[#9DAFA0] space-y-2 transition-colors duration-200">
        <div className="flex items-center justify-center gap-2 text-[#3D3D3D] dark:text-[#CBD5CB]">
          <span className="w-2 h-2 rounded-full bg-[#5A6D56]" />
          <span className="font-semibold text-[#2C362B] dark:text-[#EAEFE9]">AstraSafe Network Active</span>
          <span>•</span>
          <span>Encrypted Community Protocol for Women Solo Explorers</span>
        </div>
        <p>Himachal Pradesh Tourism & Disaster Management Board Compliant • 24/7 Women Emergency Helpline 1091</p>
      </footer>

      {/* IN-APP DIRECT ENCRYPTED CHAT & CALL MODAL */}
      <DirectChatAndCallModal
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false);
          setActiveChatPeer(null);
          setInitialCallMode(null);
        }}
        currentUser={user}
        activeChatPeer={activeChatPeer}
        initialCallMode={initialCallMode}
      />

      {/* MODALS */}
      <FemaleOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentUser={user}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      <IDVerificationModal
        user={user}
        isOpen={isIDModalOpen}
        onClose={() => setIsIDModalOpen(false)}
        onUpdateUser={(updated) => setUser(updated)}
      />

      <PrivacySettingsModal
        user={user}
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onUpdatePrivacy={handleUpdatePrivacy}
      />

      <SOSModal
        user={user}
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        currentLocationName={activeDestination.name}
      />

      {/* Offline Map Modal */}
      <OfflineMapModal
        destinations={destinations}
        activeDestinationId={selectedDestId}
        isOpen={isOfflineMapModalOpen}
        onClose={() => setIsOfflineMapModalOpen(false)}
      />

      {/* Safety Score Methodology & Audit Modal */}
      <SafetyScoreMethodologyModal
        destination={activeDestination}
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />

      {/* Fake Call Escape Modal */}
      <FakeCallModal
        isOpen={isFakeCallModalOpen}
        onClose={() => setIsFakeCallModalOpen(false)}
      />

      {/* Cab Safety Guard & Child Lock Check Modal */}
      <CabSafetyModal
        user={user}
        isOpen={isCabSafetyModalOpen}
        onClose={() => setIsCabSafetyModalOpen(false)}
        onLaunchFakeCall={() => {
          setIsCabSafetyModalOpen(false);
          setIsFakeCallModalOpen(true);
        }}
        onTriggerSOS={() => {
          setIsCabSafetyModalOpen(false);
          setIsSOSModalOpen(true);
        }}
      />

      {/* Emergency Helplines Directory Modal */}
      <EmergencyDirectoryModal
        isOpen={isEmergencyDirectoryOpen}
        onClose={() => setIsEmergencyDirectoryOpen(false)}
        currentLocationName={activeDestination.name}
        selectedDestinationId={selectedDestId}
      />

    </div>
  );
}
