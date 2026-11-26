import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Camera,
  HeartPulse,
  MapPin,
  X,
  ArrowRight,
  Shield,
  RefreshCw,
  User,
  Compass,
  AlertTriangle,
  Smartphone,
  Info,
  ChevronLeft
} from 'lucide-react';
import { UserProfile } from '../types';
import { AstraSafeLogo } from './AstraSafeLogo';

interface FemaleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onCompleteOnboarding: (profile: UserProfile, selectedDestId?: string) => void;
  onBackToSplash?: () => void;
}

export const FemaleOnboardingModal: React.FC<FemaleOnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCompleteOnboarding,
  onBackToSplash,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // 1. Basic Account & Profile Details
  const [name, setName] = useState<string>(currentUser.name || '');
  const [handle, setHandle] = useState<string>(currentUser.handle || '');
  const [age, setAge] = useState<string>(currentUser.age ? String(currentUser.age) : '26');
  const [profession, setProfession] = useState<string>(currentUser.profession || 'Solo Backpacker & Explorer');
  const [homeCity, setHomeCity] = useState<string>(currentUser.homeCity || 'Bengaluru, India');
  const [targetDestination, setTargetDestination] = useState<string>(
    currentUser.currentTrip?.destination || 'Manali & Solang Valley, Himachal Pradesh'
  );

  // 2. ID & Biometric Liveness Verification Questions
  const [idType, setIdType] = useState<'national_id' | 'passport' | 'driver_license'>('national_id');
  const [idNumber, setIdNumber] = useState<string>('');
  const [isCapturingSelfie, setIsCapturingSelfie] = useState<boolean>(false);
  const [livenessPassed, setLivenessPassed] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [pledgeAccepted, setPledgeAccepted] = useState<boolean>(false);

  // 3. Safety, Emergency Contacts & Privacy Preferences Questions
  const [primaryContactName, setPrimaryContactName] = useState<string>(
    currentUser.emergencyContacts[0]?.name || ''
  );
  const [primaryContactRelation, setPrimaryContactRelation] = useState<string>(
    currentUser.emergencyContacts[0]?.relation || 'Parent'
  );
  const [primaryContactPhone, setPrimaryContactPhone] = useState<string>(
    currentUser.emergencyContacts[0]?.phone || ''
  );
  const [bloodGroup, setBloodGroup] = useState<string>(currentUser.bloodGroup || 'O+');
  const [medicalNotes, setMedicalNotes] = useState<string>(
    currentUser.medicalNotes || ''
  );

  // Granular Privacy
  const [nameDisplay, setNameDisplay] = useState<'first_initial' | 'full' | 'handle_only'>('first_initial');
  const [locationVisibility, setLocationVisibility] = useState<'fuzzy_3km' | 'exact' | 'hidden'>('fuzzy_3km');
  const [showAge, setShowAge] = useState<boolean>(false);
  const [showProfession, setShowProfession] = useState<boolean>(true);
  const [showItinerary, setShowItinerary] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Camera check simulation / webcam capture
  const handleStartLiveness = async () => {
    setIsCapturingSelfie(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      }
    } catch {
      setCameraActive(false);
    }

    setTimeout(() => {
      setIsCapturingSelfie(false);
      setLivenessPassed(true);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    }, 1800);
  };

  const handleFinishLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedHandle = handle.startsWith('@') ? handle : `@${handle.trim().toLowerCase().replace(/\s+/g, '_') || 'explorer'}`;
    const displayName = name.trim() || 'Solo Female Explorer';

    const updatedProfile: UserProfile = {
      id: currentUser.id || `usr_${Date.now()}`,
      name: displayName,
      handle: formattedHandle,
      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: `Verified solo explorer heading to ${targetDestination.split(',')[0]}.`,
      age: Number(age) || 26,
      profession: profession.trim() || 'Explorer',
      homeCity: homeCity.trim() || 'India',
      verificationStatus: 'verified_explorer',
      idType,
      verifiedDate: new Date().toISOString().split('T')[0],
      trustScore: 99,
      badges: [
        'Government ID Verified',
        'Facial Liveness Passed',
        'Female Explorer Shield 2026',
        'Emergency Circle Active',
      ],
      bloodGroup,
      medicalNotes: medicalNotes.trim() || 'No known allergies reported.',
      privacy: {
        locationVisibility,
        nameDisplay,
        contactVisibility: 'in_app_only',
        showItinerary,
        showProfession,
        showAge,
        anonymousQueryMode: false,
      },
      emergencyContacts: [
        {
          name: primaryContactName.trim() || 'Emergency Contact',
          relation: primaryContactRelation,
          phone: primaryContactPhone.trim() || '+91 98765 43210',
        },
      ],
      currentTrip: {
        destination: targetDestination,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        registeredWithGovt: true,
        registrationId: `HPT-REG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    };

    // Map destination string to destination ID
    let mappedDestId = 'dest_manali';
    const lowerDest = targetDestination.toLowerCase();
    if (lowerDest.includes('spiti')) mappedDestId = 'dest_spiti';
    else if (lowerDest.includes('dharamshala') || lowerDest.includes('mcleod')) mappedDestId = 'dest_dharamshala';
    else if (lowerDest.includes('kasol') || lowerDest.includes('parvati')) mappedDestId = 'dest_kasol';
    else if (lowerDest.includes('jibhi') || lowerDest.includes('tirthan')) mappedDestId = 'dest_jibhi';
    else if (lowerDest.includes('bir') || lowerDest.includes('billing')) mappedDestId = 'dest_bir';

    onCompleteOnboarding(updatedProfile, mappedDestId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#121813]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#18221A] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl w-full max-w-2xl text-[#2C362B] dark:text-[#EAEFE9] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D5] dark:border-[#2C382E] bg-[#FAF8F5] dark:bg-[#1E2920] shrink-0">
          <div className="flex items-center gap-3">
            {onBackToSplash && (
              <button
                type="button"
                onClick={onBackToSplash}
                className="p-1.5 -ml-2 rounded-xl text-[#7A7A7A] hover:text-[#2C362B] dark:hover:text-white hover:bg-[#EAE5DA] dark:hover:bg-[#253327] transition cursor-pointer"
                title="Back to Welcome Splash"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <AstraSafeLogo size="sm" showWordmark={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-black text-[#2C362B] dark:text-[#FFFFFF]">
                  Female Explorer Verification & Login
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] border border-[#5A6D56]/30">
                  Zero Bots
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">
                Step {currentStep} of 3 • Answer required safety & verification questions to login
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8A8A8A] hover:text-[#2C362B] dark:hover:text-[#FFFFFF] transition cursor-pointer"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="grid grid-cols-3 border-b border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold text-center bg-[#FAF8F5]/60 dark:bg-[#161F17] shrink-0">
          <button
            onClick={() => setCurrentStep(1)}
            className={`py-3 px-2 border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'border-[#5A6D56] text-[#5A6D56] dark:text-[#88B084] bg-white dark:bg-[#18221A]'
                : 'border-transparent text-[#8A8A8A] hover:text-[#2C362B] dark:hover:text-[#CBD5CB]'
            }`}
          >
            <span>1. Profile & Trip</span>
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`py-3 px-2 border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 2
                ? 'border-[#5A6D56] text-[#5A6D56] dark:text-[#88B084] bg-white dark:bg-[#18221A]'
                : 'border-transparent text-[#8A8A8A] hover:text-[#2C362B] dark:hover:text-[#CBD5CB]'
            }`}
          >
            <span>2. ID & Liveness</span>
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`py-3 px-2 border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 3
                ? 'border-[#5A6D56] text-[#5A6D56] dark:text-[#88B084] bg-white dark:bg-[#18221A]'
                : 'border-transparent text-[#8A8A8A] hover:text-[#2C362B] dark:hover:text-[#CBD5CB]'
            }`}
          >
            <span>3. SOS & Privacy</span>
          </button>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleFinishLogin} className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          
          {/* STEP 1: TRAVELER DETAILS & DESTINATION */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-[#F0F4EF] dark:bg-[#202C22] border border-[#5A6D56]/30 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] shrink-0 mt-0.5" />
                <p className="text-xs text-[#3D3D3D] dark:text-[#CBD5CB] leading-relaxed">
                  Please provide your personal explorer details. This enables vetted communication with verified female travelers and local rescue coordination in Himalayan zones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56]"
                  />
                </div>

                {/* Handle / Username */}
                <div>
                  <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                    Community Handle / Username
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. @ananya_peaks"
                    className="w-full bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56]"
                  />
                </div>

                {/* Home City */}
                <div>
                  <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                    Home City & State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56]"
                  />
                </div>

                {/* Age & Profession */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Age <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={18}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2.5 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Profession
                    </label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Designer / Engineer"
                      className="w-full bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2.5 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56]"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Selector */}
              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                  Which Himalayan destination are you traveling to or currently exploring? <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    value={targetDestination}
                    onChange={(e) => setTargetDestination(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56] cursor-pointer"
                  >
                    <option value="Manali & Solang Valley, Himachal Pradesh">Manali & Solang Valley, Himachal Pradesh</option>
                    <option value="Spiti Valley (Kaza, Tabo & Kunzum Pass), Himachal Pradesh">Spiti Valley (Kaza, Tabo & Kunzum Pass), Himachal Pradesh</option>
                    <option value="Dharamshala & McLeod Ganj, Himachal Pradesh">Dharamshala & McLeod Ganj, Himachal Pradesh</option>
                    <option value="Kasol & Parvati Valley, Himachal Pradesh">Kasol & Parvati Valley, Himachal Pradesh</option>
                    <option value="Jibhi & Tirthan Valley, Himachal Pradesh">Jibhi & Tirthan Valley, Himachal Pradesh</option>
                    <option value="Bir Billing & Kangra, Himachal Pradesh">Bir Billing & Kangra, Himachal Pradesh</option>
                    <option value="Shimla & Mashobra, Himachal Pradesh">Shimla & Mashobra, Himachal Pradesh</option>
                  </select>
                </div>
              </div>

              {/* NAVIGATION */}
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!name.trim()}
                  className="px-6 py-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Next: ID & Liveness Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ID & BIOMETRIC LIVENESS VERIFICATION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-[#F0F4EF] dark:bg-[#202C22] border border-[#5A6D56]/30 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] shrink-0 mt-0.5" />
                <p className="text-xs text-[#3D3D3D] dark:text-[#CBD5CB] leading-relaxed">
                  AstraSafe verifies traveler credentials to maintain an authenticated female network. ID documents are validated encrypted and not shared publicly.
                </p>
              </div>

              {/* ID Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1.5">
                  Select Identification Document <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'national_id', label: 'National ID / Aadhaar' },
                    { id: 'passport', label: 'Passport' },
                    { id: 'driver_license', label: "Driver's License" },
                  ].map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setIdType(doc.id as any)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        idType === doc.id
                          ? 'bg-[#F0F4EF] dark:bg-[#243326] border-[#5A6D56] text-[#2C362B] dark:text-[#FFFFFF] font-bold'
                          : 'bg-[#FAF8F5] dark:bg-[#1C261E] border-[#E5E0D5] dark:border-[#2C382E] text-[#555] dark:text-[#A0B0A2]'
                      }`}
                    >
                      <span className="text-xs block">{doc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ID Reference Number */}
              <div>
                <label className="block text-xs font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                  ID Document Number / Reference <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={idType === 'national_id' ? 'e.g. 8832 9102 4410' : 'e.g. N8192044'}
                  className="w-full bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3.5 py-2.5 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56]"
                />
              </div>

              {/* Live Selfie / Facial Liveness Check */}
              <div className="p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] bg-[#FAF8F5] dark:bg-[#1A231C] space-y-2.5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                  <span className="text-xs font-bold text-[#2C362B] dark:text-[#FFFFFF]">
                    Biometric Liveness & Female Verification Check
                  </span>
                </div>

                {cameraActive && (
                  <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-[#5A6D56] bg-black">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-dashed border-emerald-400 rounded-full m-3 pointer-events-none animate-pulse" />
                  </div>
                )}

                {!cameraActive && (
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="w-12 h-12 rounded-full bg-[#F0F4EF] dark:bg-[#253327] border border-[#5A6D56]/40 flex items-center justify-center text-[#5A6D56] dark:text-[#88B084]">
                      {livenessPassed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Camera className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-left text-xs">
                      <div className="font-bold text-[#2C362B] dark:text-[#FFFFFF]">
                        {livenessPassed ? 'Biometric Match: Passed' : 'Quick Facial Liveness Scan'}
                      </div>
                      <div className="text-[11px] text-[#7A7A7A] dark:text-[#9DAFA0]">
                        {livenessPassed ? 'Verified female explorer identity confirmed' : 'Requires 2-second camera preview check'}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleStartLiveness}
                  disabled={isCapturingSelfie}
                  className="px-4 py-2 rounded-full bg-white dark:bg-[#233125] border border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] hover:border-[#5A6D56] transition cursor-pointer inline-flex items-center gap-2"
                >
                  {isCapturingSelfie ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5A6D56]" />
                      <span>Scanning facial landmarks...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5 text-[#5A6D56]" />
                      <span>{livenessPassed ? 'Re-scan Biometrics' : 'Start Camera Liveness Check'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Safety Declaration */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  className="mt-0.5 accent-[#5A6D56]"
                />
                <span className="text-[#444] dark:text-[#CBD5CB]">
                  I declare that I am a female traveler committed to mutual safety, reporting truthful mountain conditions, and respecting local mountain communities.
                </span>
              </label>

              {/* NAVIGATION */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-full border border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold text-[#555] dark:text-[#CBD5CB] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!pledgeAccepted || !idNumber.trim()}
                  className="px-6 py-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Next: SOS & Privacy Settings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SOS EMERGENCY CONTACT & PRIVACY PREFERENCES */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-[#F0F4EF] dark:bg-[#202C22] border border-[#5A6D56]/30 flex items-start gap-2.5">
                <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-[#3D3D3D] dark:text-[#CBD5CB] leading-relaxed">
                  Configure your primary emergency contacts and decide what details are visible to fellow travelers vs kept strictly confidential.
                </p>
              </div>

              {/* Emergency Contact Information */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  Primary Emergency SOS Contact
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Contact Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={primaryContactName}
                      onChange={(e) => setPrimaryContactName(e.target.value)}
                      placeholder="e.g. Mother / Sister"
                      className="w-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2 text-xs text-[#2C362B] dark:text-[#FFFFFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Relationship <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={primaryContactRelation}
                      onChange={(e) => setPrimaryContactRelation(e.target.value)}
                      className="w-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2 text-xs text-[#2C362B] dark:text-[#FFFFFF] cursor-pointer"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Spouse/Partner">Spouse / Partner</option>
                      <option value="Friend">Close Friend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={primaryContactPhone}
                      onChange={(e) => setPrimaryContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2 text-xs text-[#2C362B] dark:text-[#FFFFFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Blood Group (For Mountain First Aid)
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2 text-xs text-[#2C362B] dark:text-[#FFFFFF] cursor-pointer"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Medical / Altitude Notes
                    </label>
                    <input
                      type="text"
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      placeholder="e.g. Mild asthma inhaler, Diamox carried..."
                      className="w-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2 text-xs text-[#2C362B] dark:text-[#FFFFFF]"
                    />
                  </div>
                </div>
              </div>

              {/* Granular Privacy Choices */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6D56] dark:text-[#88B084] block">
                  Profile Sharing & Privacy Controls
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Name Display
                    </label>
                    <select
                      value={nameDisplay}
                      onChange={(e) => setNameDisplay(e.target.value as any)}
                      className="w-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2 text-xs text-[#2C362B] dark:text-[#FFFFFF] cursor-pointer"
                    >
                      <option value="first_initial">First Name + Initial ({name.split(' ')[0] || 'Ananya'} R.)</option>
                      <option value="full">Full Name ({name || 'Ananya Sharma'})</option>
                      <option value="handle_only">Handle Only ({handle || '@explorer'})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#555] dark:text-[#9DAFA0] mb-1">
                      Location Precision
                    </label>
                    <select
                      value={locationVisibility}
                      onChange={(e) => setLocationVisibility(e.target.value as any)}
                      className="w-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl px-3 py-2 text-xs text-[#2C362B] dark:text-[#FFFFFF] cursor-pointer"
                    >
                      <option value="fuzzy_3km">Fuzzy 3km Safe Radius (Recommended)</option>
                      <option value="exact">Exact GPS (Vetted Matches Only)</option>
                      <option value="hidden">Hidden from Public Radar</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#444] dark:text-[#CBD5CB]">
                    <input
                      type="checkbox"
                      checked={showProfession}
                      onChange={(e) => setShowProfession(e.target.checked)}
                      className="accent-[#5A6D56]"
                    />
                    <span>Show Profession</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#444] dark:text-[#CBD5CB]">
                    <input
                      type="checkbox"
                      checked={showAge}
                      onChange={(e) => setShowAge(e.target.checked)}
                      className="accent-[#5A6D56]"
                    />
                    <span>Show Age ({age} yrs)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#444] dark:text-[#CBD5CB]">
                    <input
                      type="checkbox"
                      checked={showItinerary}
                      onChange={(e) => setShowItinerary(e.target.checked)}
                      className="accent-[#5A6D56]"
                    />
                    <span>Share Trek Itinerary</span>
                  </label>
                </div>
              </div>

              {/* NAVIGATION & SUBMIT BUTTON */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-full border border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold text-[#555] dark:text-[#CBD5CB] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!primaryContactName.trim() || !primaryContactPhone.trim()}
                  className="px-6 py-3 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Complete Verification & Enter App →</span>
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
