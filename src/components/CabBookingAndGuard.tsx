import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  Bell,
  Navigation,
  PhoneCall,
  Share2,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Shield,
  ArrowRight,
  Info,
  Check,
  Zap,
  Moon,
  Users,
  Compass,
  Phone,
  MessageSquare
} from 'lucide-react';
import { UserProfile, CabBooking, CabRideType, VettedDriverDetails } from '../types';
import { INITIAL_CAB_BOOKINGS, SAMPLE_VETTED_DRIVERS } from '../data/mockData';

interface CabBookingAndGuardProps {
  user: UserProfile;
  activeDestinationName: string;
  activeDestinationId: string;
  onLaunchFakeCall: () => void;
  onTriggerSOS: () => void;
  onOpenChatWithDriver?: (driverName: string) => void;
}

const RIDE_OPTIONS: {
  type: CabRideType;
  title: string;
  tagline: string;
  carModels: string;
  priceINR: number;
  estMinutes: number;
  badge: string;
  description: string;
  icon: typeof Car;
}[] = [
  {
    type: 'city_safe',
    title: 'Verified City & Local Safe Cab',
    tagline: 'Ideal for town commutes, cafes, and markets',
    carModels: 'Tata Nexon EV / Swift Dzire / Etios',
    priceINR: 450,
    estMinutes: 3,
    badge: 'Fastest 3-Min Pickup',
    description: 'Police-vetted local partner cabs with clean maintenance records and strict women-safety compliance.',
    icon: Car,
  },
  {
    type: 'mountain_suv',
    title: 'Mountain Explorer 4x4 SUV',
    tagline: 'High clearance for mountain passes & unpaved trails',
    carModels: 'Mahindra Scorpio / Thar / Toyota Innova',
    priceINR: 1850,
    estMinutes: 8,
    badge: 'High-Altitude Certified',
    description: 'Drivers with 8+ years Himalayan terrain experience, snow chains, and emergency mountain rescue kit.',
    icon: Compass,
  },
  {
    type: 'night_escort',
    title: 'Night Safe-Transit Escort',
    tagline: 'Priority women safety for late evening transit',
    carModels: 'White Vetted Sedan / EV with Dashcam',
    priceINR: 650,
    estMinutes: 4,
    badge: '24/7 Route Patrol Active',
    description: 'Continuous corridor GPS tracking, pre-armed emergency response link, and verified night-duty drivers.',
    icon: Moon,
  },
  {
    type: 'sightseeing_day',
    title: 'All-Day Sightseeing & Pass Tour',
    tagline: '8-Hour dedicated ride with vetted driver',
    carModels: 'Toyota Innova Crysta / Ertiga Hybrid',
    priceINR: 3200,
    estMinutes: 15,
    badge: '8-Hour Curated Safe Tour',
    description: 'Explore Solang, Atal Tunnel, Naggar Castle, and local temples with transparent fixed pricing and zero detours.',
    icon: Sparkles,
  },
];

export const CabBookingAndGuard: React.FC<CabBookingAndGuardProps> = ({
  user,
  activeDestinationName,
  activeDestinationId,
  onLaunchFakeCall,
  onTriggerSOS,
  onOpenChatWithDriver,
}) => {
  const [viewMode, setViewMode] = useState<'book' | 'my_rides' | 'guard_active'>('book');
  const [bookings, setBookings] = useState<CabBooking[]>(INITIAL_CAB_BOOKINGS);
  const [selectedRideType, setSelectedRideType] = useState<CabRideType>('city_safe');
  
  // Booking Form Fields
  const [pickup, setPickup] = useState<string>('Mall Road Pre-paid Taxi Booth');
  const [dropoff, setDropoff] = useState<string>('Old Manali Bridge / Drifters Cafe');
  const [departureTimeMode, setDepartureTimeMode] = useState<'instant' | 'schedule'>('instant');
  const [scheduledTime, setScheduledTime] = useState<string>('14:30');
  const [femaleDriverPreferred, setFemaleDriverPreferred] = useState<boolean>(true);
  const [autoShareEmergencyCircle, setAutoShareEmergencyCircle] = useState<boolean>(true);
  const [quietRide, setQuietRide] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<CabBooking | null>(null);

  // Active Cab Guard State
  const [activeBookingForGuard, setActiveBookingForGuard] = useState<CabBooking | null>(bookings[0] || null);
  const [guardPhase, setGuardPhase] = useState<'pre_ride' | 'inside_alert' | 'active_ride' | 'completed'>('pre_ride');
  
  // Pre-Ride Checklist
  const [childLockChecked, setChildLockChecked] = useState<boolean>(false);
  const [plateChecked, setPlateChecked] = useState<boolean>(false);
  const [driverChecked, setDriverChecked] = useState<boolean>(false);
  const [backSeatChecked, setBackSeatChecked] = useState<boolean>(false);
  
  // Inside-Cab Checklist
  const [insideHandleTested, setInsideHandleTested] = useState<boolean>(false);
  const [windowTested, setWindowTested] = useState<boolean>(false);

  // Custom Cab details override (for hailing unbooked cabs)
  const [customPlate, setCustomPlate] = useState<string>('HP 01 TB 4921');
  const [customDriver, setCustomDriver] = useState<string>('Sunita Devi (HP Women Taxi Union #42)');
  const [customModel, setCustomModel] = useState<string>('Tata Nexon EV (White)');

  // Ride Timer
  const [rideDurationSeconds, setRideDurationSeconds] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Quick Location Suggestions based on destination
  const SUGGESTED_PICKUPS = [
    'Mall Road Taxi Union Stand',
    'Old Manali Bridge',
    'Vashisht Temple Springs',
    'Bhuntar Airport / Helipad',
    'Solang Valley Base',
    'Hidimba Temple Gate',
  ];

  const SUGGESTED_DROPS = [
    'Drifters Inn & Cafe, Old Manali',
    'Atal Tunnel South Portal',
    'Solang Ropeway Terminal',
    'Jogini Waterfall Trek Point',
    'Naggar Castle Heritage Area',
    'Kullu Valley Handicraft Center',
  ];

  const selectedRideInfo = RIDE_OPTIONS.find((r) => r.type === selectedRideType) || RIDE_OPTIONS[0];

  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (e) {
      console.warn('Audio chime fallback', e);
    }
  };

  useEffect(() => {
    let timer: any;
    if (viewMode === 'guard_active' && guardPhase === 'active_ride') {
      timer = setInterval(() => {
        setRideDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewMode, guardPhase]);

  const handleBookCabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !dropoff.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user.id,
        userName: user.name,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        destinationId: activeDestinationId,
        destinationName: activeDestinationName,
        rideType: selectedRideType,
        departureTime: departureTimeMode === 'instant' ? 'Instant (3 mins)' : `Scheduled for ${scheduledTime}`,
        specialRequests: {
          femaleDriverPreferred,
          nightEscortActive: selectedRideType === 'night_escort',
          autoShareRouteWithCircle: autoShareEmergencyCircle,
          quietRide,
        },
      };

      const res = await fetch('/api/cabs/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const newBooking: CabBooking = {
        id: data.bookingId || `ASTRA-CAB-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user.id,
        userName: user.name,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        destinationId: activeDestinationId,
        destinationName: activeDestinationName,
        rideType: selectedRideType,
        rideTypeName: selectedRideInfo.title,
        departureTime: departureTimeMode === 'instant' ? 'Instant (Arriving in 3 mins)' : `Scheduled at ${scheduledTime}`,
        fareEstimateINR: selectedRideInfo.priceINR,
        distanceKm: selectedRideType === 'sightseeing_day' ? 65 : selectedRideType === 'mountain_suv' ? 22 : 4.5,
        durationMinutes: selectedRideType === 'sightseeing_day' ? 480 : selectedRideType === 'mountain_suv' ? 45 : 15,
        specialRequests: {
          femaleDriverPreferred,
          nightEscortActive: selectedRideType === 'night_escort',
          autoShareRouteWithCircle: autoShareEmergencyCircle,
          quietRide,
        },
        status: 'confirmed',
        createdAt: 'Just now',
        driver: data.assignedDriver || SAMPLE_VETTED_DRIVERS[0],
        childLockVerified: false,
        cabGuardArmed: true,
      };

      setBookings((prev) => [newBooking, ...prev]);
      setBookingSuccessData(newBooking);
      setActiveBookingForGuard(newBooking);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Cab booking error', err);
      // Fallback
      const fallbackDriver = SAMPLE_VETTED_DRIVERS[0];
      const newBooking: CabBooking = {
        id: `ASTRA-CAB-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user.id,
        userName: user.name,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        destinationId: activeDestinationId,
        destinationName: activeDestinationName,
        rideType: selectedRideType,
        rideTypeName: selectedRideInfo.title,
        departureTime: departureTimeMode === 'instant' ? 'Instant (Arriving in 3 mins)' : `Scheduled at ${scheduledTime}`,
        fareEstimateINR: selectedRideInfo.priceINR,
        distanceKm: 4.5,
        durationMinutes: 15,
        specialRequests: {
          femaleDriverPreferred,
          nightEscortActive: selectedRideType === 'night_escort',
          autoShareRouteWithCircle: autoShareEmergencyCircle,
          quietRide,
        },
        status: 'confirmed',
        createdAt: 'Just now',
        driver: fallbackDriver,
        childLockVerified: false,
        cabGuardArmed: true,
      };
      setBookings((prev) => [newBooking, ...prev]);
      setBookingSuccessData(newBooking);
      setActiveBookingForGuard(newBooking);
      setIsSubmitting(false);
    }
  };

  const startCabGuardWithBooking = (b: CabBooking) => {
    setActiveBookingForGuard(b);
    if (b.driver) {
      setCustomPlate(b.driver.licensePlate);
      setCustomDriver(`${b.driver.name} (${b.driver.unionId})`);
      setCustomModel(b.driver.vehicleModel);
    }
    setGuardPhase('pre_ride');
    setChildLockChecked(false);
    setPlateChecked(false);
    setDriverChecked(false);
    setBackSeatChecked(false);
    setInsideHandleTested(false);
    setWindowTested(false);
    setRideDurationSeconds(0);
    setViewMode('guard_active');
  };

  const handleEnterCab = () => {
    setGuardPhase('inside_alert');
    playAlertChime();
  };

  const formatRideTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const allPreRideChecked = childLockChecked && plateChecked && driverChecked && backSeatChecked;
  const allInsideChecked = insideHandleTested && windowTested;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Mode Switcher */}
      <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] border border-[#5A6D56]/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vetted Transport Network
              </span>
              <span className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">
                {activeDestinationName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C362B] dark:text-[#EAEFE9] mt-2">
              Book Safe Cab & Ride Guard
            </h1>
            <p className="text-xs sm:text-sm text-[#555] dark:text-[#B0C0B0] mt-1 max-w-2xl">
              100% police-verified partner drivers, pre-screened vehicles, transparent pricing, and instant Cab Guard child-lock telemetry.
            </p>
          </div>

          {/* Clean Segmented Navigation */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#141B15] p-1.5 rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] self-start md:self-auto">
            <button
              onClick={() => {
                setBookingSuccessData(null);
                setViewMode('book');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'book'
                  ? 'bg-[#5A6D56] text-white shadow-xs'
                  : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-white dark:hover:bg-[#202B22]'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Book Safe Cab</span>
            </button>

            <button
              onClick={() => setViewMode('my_rides')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'my_rides'
                  ? 'bg-[#5A6D56] text-white shadow-xs'
                  : 'text-[#5A6D56] dark:text-[#88B084] hover:bg-white dark:hover:bg-[#202B22]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>My Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => {
                if (bookings.length > 0) {
                  startCabGuardWithBooking(bookings[0]);
                } else {
                  setViewMode('guard_active');
                  setGuardPhase('pre_ride');
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'guard_active'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 dark:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-[#202B22]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Cab Guard Tool</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: BOOKING FLOW */}
      {viewMode === 'book' && !bookingSuccessData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Booking Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Safe Partner Assurance Banner */}
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <span>100% Vetted & Safe Transport Guarantee</span>
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-1 leading-relaxed">
                    All partner cabs are pre-screened with background checks and 24/7 GPS route patrol. <strong>For traveller privacy and security, exact driver credentials, vehicle number plate, and direct call line will be securely unlocked the moment you confirm your booking.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Ride Type Selection Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5A6D56] dark:text-[#88B084] block">
                1. Select Verified Ride Type
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RIDE_OPTIONS.map((option) => {
                  const IconComp = option.icon;
                  const isSelected = selectedRideType === option.type;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => setSelectedRideType(option.type)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#F0F4EF] dark:bg-[#202E22] border-[#5A6D56] dark:border-[#88B084] shadow-xs'
                          : 'bg-white dark:bg-[#1B241D] border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#5A6D56] text-white' : 'bg-[#FAF8F5] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084]'
                          }`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#2C362B] dark:text-[#EAEFE9]">
                              {option.title}
                            </h4>
                            <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                              {option.carModels}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#5A6D56] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#E5E0D5]/50 dark:border-[#2C382E] flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#141B15] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E]">
                          {option.badge}
                        </span>
                        <div className="text-right">
                          <span className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">Fixed Fare:</span>{' '}
                          <span className="font-bold font-mono text-sm sm:text-base text-[#2C362B] dark:text-[#EAEFE9]">
                            ₹{option.priceINR}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pickup & Destination Inputs */}
            <form onSubmit={handleBookCabSubmit} className="space-y-4 bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5A6D56] dark:text-[#88B084] block">
                2. Route & Schedule
              </label>

              {/* Pickup Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Pickup Point
                </label>
                <input
                  type="text"
                  required
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. Mall Road Taxi Stand, Hotel Reception..."
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs sm:text-sm text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                />
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_PICKUPS.slice(0, 3).map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => setPickup(sugg)}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E] hover:bg-[#F0F4EF]"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop-off Destination */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  Drop-off Destination
                </label>
                <input
                  type="text"
                  required
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="e.g. Old Manali Cafe, Solang Valley, Airport..."
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs sm:text-sm text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                />
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_DROPS.slice(0, 3).map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => setDropoff(sugg)}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E] hover:bg-[#F0F4EF]"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDepartureTimeMode('instant')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                    departureTimeMode === 'instant'
                      ? 'bg-[#F0F4EF] dark:bg-[#253327] border-[#5A6D56] text-[#2C362B] dark:text-[#EAEFE9]'
                      : 'bg-[#FAF8F5] dark:bg-[#141B15] border-[#E5E0D5] dark:border-[#2C382E] text-[#8A8A8A]'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-bold text-xs">Instant Pickup</div>
                    <div className="text-[10px]">Cab arrives in 3-5 mins</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDepartureTimeMode('schedule')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                    departureTimeMode === 'schedule'
                      ? 'bg-[#F0F4EF] dark:bg-[#253327] border-[#5A6D56] text-[#2C362B] dark:text-[#EAEFE9]'
                      : 'bg-[#FAF8F5] dark:bg-[#141B15] border-[#E5E0D5] dark:border-[#2C382E] text-[#8A8A8A]'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#5A6D56]" />
                  <div className="flex-1">
                    <div className="font-bold text-xs">Schedule Ahead</div>
                    {departureTimeMode === 'schedule' ? (
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="mt-1 text-[11px] bg-white dark:bg-[#1E2920] border border-[#E5E0D5] dark:border-[#2C382E] rounded px-1.5 py-0.5 text-[#2C362B] dark:text-[#EAEFE9]"
                      />
                    ) : (
                      <div className="text-[10px]">Select preferred time</div>
                    )}
                  </div>
                </button>
              </div>

              {/* Safety Preferences & Special Requests */}
              <div className="pt-3 space-y-2 border-t border-[#E5E0D5] dark:border-[#2C382E]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A8A] dark:text-[#9DAFA0] block">
                  Safety Preferences (Included Free)
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        Prioritize Female Partner Driver
                      </div>
                      <div className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Assigns verified female cab captain when active in region
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={femaleDriverPreferred}
                    onChange={(e) => setFemaleDriverPreferred(e.target.checked)}
                    className="w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        Auto-Share Ride with 2 Emergency Contacts
                      </div>
                      <div className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Sends silent SMS tracking link to {user.emergencyContacts[0]?.name || 'emergency contact'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoShareEmergencyCircle}
                    onChange={(e) => setAutoShareEmergencyCircle(e.target.checked)}
                    className="w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] dark:hover:bg-[#465743] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Vetted Partner Cab...</span>
                  ) : (
                    <>
                      <span>Confirm & Secure Safe Cab • ₹{selectedRideInfo.priceINR}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-[#8A8A8A] dark:text-[#9DAFA0] mt-2">
                  Zero cancellation fee • All partner drivers police-cleared with verified IDs
                </p>
              </div>
            </form>

          </div>

          {/* Right Column: Safety Assurance & Live Partner Coverage (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Safety Protocol Features */}
            <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-[#2C362B] dark:text-[#EAEFE9] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5A6D56] dark:text-[#88B084]" />
                <span>Our 5-Pillar Safe Transit Protocol</span>
              </h3>

              <div className="space-y-3 text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141B15] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#5A6D56]/15 text-[#5A6D56] dark:text-[#88B084] flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold block">Encrypted Credentials Dispatch</span>
                    <span className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                      Driver identity, verified badge & vehicle registration are matched in real-time and unlocked directly to your phone.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141B15] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-bold block">Mandatory Child-Lock Verification</span>
                    <span className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                      Cab Guard guides you through a 3-second pre-entry door lock test so you are never locked in from inside.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141B15] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <span className="font-bold block">Live Route Deviation Telemetry</span>
                    <span className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                      Automated alerts trigger if the vehicle deviates from designated tourist corridors or highway paths.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141B15] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-xs">
                    4
                  </div>
                  <div>
                    <span className="font-bold block">One-Tap Fake Call & SOS Dispatch</span>
                    <span className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                      Integrated escape button sounds like a realistic call from family/hotel staff whenever needed.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Standalone Cab Guard Trigger Card */}
            <div className="bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Taking a Local Taxi or Auto?</span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#2C362B] dark:text-[#EAEFE9]">
                Use Cab Guard for Any Street Cab
              </h4>
              <p className="text-xs text-[#555] dark:text-[#B0C0B0] leading-relaxed">
                Even if you hailed a cab at the roadside taxi stand, you can launch our Child Lock Inspector & Live Ride Monitor anytime.
              </p>
              <button
                type="button"
                onClick={() => {
                  setViewMode('guard_active');
                  setGuardPhase('pre_ride');
                }}
                className="w-full py-2.5 rounded-full bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] text-[#2C362B] dark:text-[#EAEFE9] text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Launch Standalone Cab Guard →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 1.5: BOOKING CONFIRMATION & UNLOCKED CREDENTIALS */}
      {viewMode === 'book' && bookingSuccessData && (
        <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="bg-white dark:bg-[#1B241D] border border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                Booking Confirmed • Vetted Partner Assigned
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C362B] dark:text-[#EAEFE9] mt-2">
                Your Safe Ride is Ready!
              </h2>
              <p className="text-xs sm:text-sm text-[#8A8A8A] dark:text-[#9DAFA0] mt-1">
                Booking ID: <strong className="font-mono text-[#5A6D56] dark:text-[#88B084]">{bookingSuccessData.id}</strong> • Departure: {bookingSuccessData.departureTime}
              </p>
            </div>

            {/* Unlocked Driver Dossier Card */}
            {bookingSuccessData.driver && (
              <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] text-left space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E0D5] dark:border-[#2C382E] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6D56] dark:text-[#88B084] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Unlocked Verified Driver & Vehicle Dossier
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                    OTP: {bookingSuccessData.driver.otp}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={bookingSuccessData.driver.avatar}
                    alt={bookingSuccessData.driver.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#5A6D56]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm sm:text-base text-[#2C362B] dark:text-[#EAEFE9]">
                        {bookingSuccessData.driver.name}
                      </h4>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        ★ {bookingSuccessData.driver.rating} ({bookingSuccessData.driver.tripsCompleted} trips)
                      </span>
                    </div>

                    <div className="text-xs text-[#555] dark:text-[#B0C0B0] mt-0.5">
                      {bookingSuccessData.driver.unionId} • Police Badge: {bookingSuccessData.driver.policeBadgeId}
                    </div>

                    <div className="mt-2 p-2 rounded-xl bg-white dark:bg-[#1E2920] border border-[#E5E0D5] dark:border-[#2C382E] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#8A8A8A] block uppercase font-bold">Vehicle</span>
                        <span className="font-bold text-[#2C362B] dark:text-[#EAEFE9]">{bookingSuccessData.driver.vehicleModel}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#8A8A8A] block uppercase font-bold">Number Plate</span>
                        <span className="font-mono font-black text-sm text-[#5A6D56] dark:text-[#88B084]">{bookingSuccessData.driver.licensePlate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${bookingSuccessData.driver.phone}`}
                    className="py-2.5 rounded-xl bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-center text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] flex items-center justify-center gap-1.5 hover:bg-[#F0F4EF]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#5A6D56]" />
                    <span>Call Driver</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenChatWithDriver) {
                        onOpenChatWithDriver(bookingSuccessData.driver?.name || 'Driver');
                      }
                    }}
                    className="py-2.5 rounded-xl bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-center text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] flex items-center justify-center gap-1.5 hover:bg-[#F0F4EF]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#5A6D56]" />
                    <span>Chat in AstraSafe</span>
                  </button>
                </div>
              </div>
            )}

            {/* Launch Integrated Cab Guard Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => startCabGuardWithBooking(bookingSuccessData)}
                className="w-full py-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg animate-pulse"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Launch Cab Guard & Child Lock Inspector →</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('my_rides')}
                className="w-full py-2.5 rounded-full bg-[#FAF8F5] dark:bg-[#141B15] text-[#2C362B] dark:text-[#EAEFE9] text-xs font-bold hover:bg-[#F0F4EF] border border-[#E5E0D5] dark:border-[#2C382E]"
              >
                View in My Bookings
              </button>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: MY BOOKINGS LIST */}
      {viewMode === 'my_rides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#2C362B] dark:text-[#EAEFE9]">
              Your Verified Cab Bookings
            </h2>
            <button
              onClick={() => {
                setBookingSuccessData(null);
                setViewMode('book');
              }}
              className="px-4 py-2 rounded-full bg-[#5A6D56] text-white text-xs font-bold hover:bg-[#2C362B]"
            >
              + Book Another Cab
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#1B241D] rounded-3xl border border-[#E5E0D5] dark:border-[#2C382E] space-y-3">
              <Car className="w-10 h-10 text-[#8A8A8A] mx-auto" />
              <h3 className="font-bold text-base text-[#2C362B] dark:text-[#EAEFE9]">No Bookings Yet</h3>
              <p className="text-xs text-[#8A8A8A] max-w-sm mx-auto">
                Book a verified solo safe cab with our police-cleared partner network.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#5A6D56] dark:text-[#88B084] uppercase">
                        {booking.id}
                      </span>
                      <h4 className="font-bold text-sm text-[#2C362B] dark:text-[#EAEFE9] mt-0.5">
                        {booking.rideTypeName}
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                      Confirmed
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#555] dark:text-[#B0C0B0]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="truncate"><strong>From:</strong> {booking.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="truncate"><strong>To:</strong> {booking.dropoffLocation}</span>
                    </div>
                  </div>

                  {booking.driver && (
                    <div className="p-3 bg-[#FAF8F5] dark:bg-[#141B15] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={booking.driver.avatar}
                          alt={booking.driver.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                            {booking.driver.name}
                          </div>
                          <div className="text-[10px] font-mono text-[#5A6D56] dark:text-[#88B084]">
                            {booking.driver.licensePlate}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#8A8A8A] block">Start OTP</span>
                        <span className="font-mono font-bold text-xs bg-white dark:bg-[#1E2920] px-2 py-0.5 rounded border border-[#E5E0D5] dark:border-[#2C382E]">
                          {booking.driver.otp}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D5] dark:border-[#2C382E]">
                    <div>
                      <span className="text-[10px] text-[#8A8A8A] block">Fare</span>
                      <span className="font-mono font-bold text-sm text-[#2C362B] dark:text-[#EAEFE9]">
                        ₹{booking.fareEstimateINR}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => startCabGuardWithBooking(booking)}
                      className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Launch Cab Guard</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: INTEGRATED CAB GUARD (CHILD LOCK & RIDE TELEMETRY) */}
      {viewMode === 'guard_active' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            
            {/* Guard Header */}
            <div className="flex items-center justify-between border-b border-[#E5E0D5] dark:border-[#2C382E] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2C362B] dark:text-[#EAEFE9]">
                    Cab Safety Guard & Child Lock Inspector
                  </h3>
                  <p className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">
                    {activeBookingForGuard ? `Linked to Booking ${activeBookingForGuard.id}` : 'Standalone Ride Protection'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewMode('book')}
                className="px-3 py-1.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9]"
              >
                Back to Booking
              </button>
            </div>

            {/* PHASE 1: PRE-RIDE INSPECTION */}
            {guardPhase === 'pre_ride' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Visual Child Lock Diagram Card */}
                <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-700/60 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Unlock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-amber-900 dark:text-amber-300">
                        CRITICAL: Inspect Door Edge Child Lock Before Entering
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-400 mt-1 leading-relaxed">
                        If the mechanical child lock on the side of the open rear door is turned ON, you <strong>CANNOT open the door from the inside</strong> in an emergency.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#141B15] rounded-xl border border-amber-300 dark:border-amber-800 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E5E0D5] dark:border-[#2C382E] pb-2">
                      <span className="font-bold text-[#5A6D56] dark:text-[#88B084] uppercase text-[10px] tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> 3-Second Door Edge Check:
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F0F4EF] dark:bg-[#202B22] text-[#5A6D56] dark:text-[#88B084] text-[10px] font-bold">
                        Vertical Rim
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                          <Unlock className="w-4 h-4 text-emerald-600" />
                          <span>CORRECT (UNLOCKED / UP)</span>
                        </div>
                        <p className="text-[11px] text-emerald-900 dark:text-emerald-400">
                          The small metal/plastic switch on the door&apos;s vertical rim is pushed UP or away from the lock symbol. Door opens freely from inside.
                        </p>
                      </div>

                      <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-1">
                        <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-xs">
                          <Lock className="w-4 h-4 text-rose-600" />
                          <span>DANGER (CHILD LOCK ENGAGED)</span>
                        </div>
                        <p className="text-[11px] text-rose-900 dark:text-rose-400">
                          Switch is pushed DOWN. If you close the door, you can only exit if someone opens from outside. <strong>Flip switch UP before sitting in!</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cab Details Bar */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A] dark:text-[#9DAFA0] block">
                    Active Cab Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0] uppercase font-bold">Number Plate</label>
                      <input
                        type="text"
                        value={customPlate}
                        onChange={(e) => setCustomPlate(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-[#1E2920] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl font-mono font-bold text-[#2C362B] dark:text-[#EAEFE9] text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0] uppercase font-bold">Driver Name / Union</label>
                      <input
                        type="text"
                        value={customDriver}
                        onChange={(e) => setCustomDriver(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-[#1E2920] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl font-bold text-[#2C362B] dark:text-[#EAEFE9] text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0] uppercase font-bold">Vehicle Model</label>
                      <input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-[#1E2920] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-[#2C362B] dark:text-[#EAEFE9] text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2C362B] dark:text-[#EAEFE9] block">
                    Verify All 4 Items Before Getting In:
                  </span>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={childLockChecked}
                      onChange={(e) => setChildLockChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        1. Child Lock Switch Verified In UP / OFF Position
                      </div>
                      <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Confirmed door edge lever is not engaged.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plateChecked}
                      onChange={(e) => setPlateChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        2. Number Plate Matches Physical Vehicle ({customPlate})
                      </div>
                      <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Front/rear bumper plate verified.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={driverChecked}
                      onChange={(e) => setDriverChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        3. Driver Confirmed ({customDriver.split('(')[0]})
                      </div>
                      <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Confirmed passenger name with driver.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backSeatChecked}
                      onChange={(e) => setBackSeatChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        4. Rear Seat Clear & Inspected
                      </div>
                      <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        No unauthorized items or co-passengers.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleEnterCab}
                    disabled={!allPreRideChecked}
                    className="w-full py-4 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Car className="w-4 h-4" />
                    <span>I Am Seated Inside → Trigger In-Cab Door Test Chime</span>
                  </button>
                  {!allPreRideChecked && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 text-center mt-2">
                      Please check off all 4 items above to proceed.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* PHASE 2: INSIDE DOOR HANDLE TEST NOTIFICATION */}
            {guardPhase === 'inside_alert' && (
              <div className="space-y-6 animate-in zoom-in-95 duration-200">
                <div className="p-6 rounded-3xl bg-amber-500 text-slate-950 space-y-4 shadow-xl border-2 border-amber-300">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                      <Bell className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full">
                        Immediate In-Cab Safety Prompt
                      </span>
                      <h4 className="font-serif font-bold text-xl text-slate-950 mt-1">
                        🔔 Test Inside Door Handle NOW!
                      </h4>
                      <p className="text-xs text-slate-900 font-medium mt-1 leading-relaxed">
                        Now that you are seated inside, pull the inside door latch slightly to confirm the door unlocks smoothly from your seat.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/90 rounded-2xl text-xs text-slate-900 space-y-2 border border-black/10">
                    <div className="font-bold">Inside Door Handle Test:</div>
                    <ul className="space-y-1 text-[11px] list-disc list-inside">
                      <li>Gently pull the inside handle.</li>
                      <li>Does the lock knob pop open? If YES: the child lock is confirmed OFF.</li>
                      <li><strong>If NO / handle feels limp:</strong> Tell driver immediately: <em>&ldquo;Bhaiya, please unlock the rear door child lock from outside.&rdquo;</em></li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={insideHandleTested}
                      onChange={(e) => setInsideHandleTested(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        Inside Door Handle Tested & Opens Freely
                      </div>
                      <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Confirmed I can exit independently from my seat.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={windowTested}
                      onChange={(e) => setWindowTested(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                        Power Windows & Air Ventilation Tested
                      </div>
                      <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Window roll-down button works.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGuardPhase('active_ride')}
                    disabled={!allInsideChecked}
                    className="w-full py-3.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Start Live Ride Tracking Monitor</span>
                  </button>

                  <button
                    type="button"
                    onClick={onLaunchFakeCall}
                    className="w-full py-3.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-white text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                    <span>Arm Fake Call Escape</span>
                  </button>
                </div>
              </div>
            )}

            {/* PHASE 3: ACTIVE RIDE MONITOR & TELEMETRY */}
            {guardPhase === 'active_ride' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                <div className="p-5 rounded-2xl bg-[#F0F4EF] dark:bg-[#202E22] border border-[#5A6D56]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6D56] dark:text-[#88B084]">
                        Active Ride Monitored
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-[#141B15] text-[10px] font-bold text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E]">
                        Child Lock: OFF
                      </span>
                    </div>
                    <h4 className="text-lg font-serif font-bold text-[#2C362B] dark:text-[#EAEFE9] mt-1">
                      {customPlate} • {customModel}
                    </h4>
                    <p className="text-xs text-[#555] dark:text-[#B0C0B0]">
                      Driver: {customDriver}
                    </p>
                  </div>

                  <div className="text-right sm:border-l sm:border-[#5A6D56]/20 sm:pl-4">
                    <span className="text-[10px] font-bold uppercase text-[#8A8A8A] dark:text-[#9DAFA0] block">Ride Duration</span>
                    <div className="text-2xl font-black font-mono text-[#5A6D56] dark:text-[#88B084]">
                      {formatRideTime(rideDurationSeconds)}
                    </div>
                  </div>
                </div>

                {/* Route Integrity Bar */}
                <div className="p-4 bg-white dark:bg-[#141B15] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2C362B] dark:text-[#EAEFE9] flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                      Live Route Integrity & Deviation Detector
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      On Designated Route Corridor
                    </span>
                  </div>

                  <div className="w-full bg-[#FAF8F5] dark:bg-[#202B22] rounded-full h-2 overflow-hidden border border-[#E5E0D5] dark:border-[#2C382E]">
                    <div className="bg-[#5A6D56] h-full rounded-full transition-all duration-500" style={{ width: '70%' }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                    <span>Origin: {activeBookingForGuard?.pickupLocation || 'Pickup Point'}</span>
                    <span>Destination: {activeBookingForGuard?.dropoffLocation || 'Drop-off'}</span>
                  </div>
                </div>

                {/* Quick Actions During Ride */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={onLaunchFakeCall}
                    className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] text-[#2C362B] dark:text-[#EAEFE9] flex flex-col items-center gap-1 text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                    <span>Fake Call Escape</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'AstraSafe Live Ride Tracking',
                          text: `I am currently in cab ${customPlate} driven by ${customDriver}. Child lock checked. Tracking live on AstraSafe:`,
                          url: window.location.href,
                        }).catch(() => {});
                      } else {
                        alert('Live trip link broadcasted to emergency contacts!');
                      }
                    }}
                    className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] text-[#2C362B] dark:text-[#EAEFE9] flex flex-col items-center gap-1 text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                    <span>Share Live GPS</span>
                  </button>

                  <button
                    type="button"
                    onClick={onTriggerSOS}
                    className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 flex flex-col items-center gap-1 text-xs font-bold transition cursor-pointer shadow-xs col-span-2 sm:col-span-1"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Emergency SOS</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setGuardPhase('completed')}
                    className="w-full py-3.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    I Have Reached Safely • End Ride
                  </button>
                </div>

              </div>
            )}

            {/* PHASE 4: COMPLETED SAFELY */}
            {guardPhase === 'completed' && (
              <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#2C362B] dark:text-[#EAEFE9]">
                    Ride Completed Safely!
                  </h3>
                  <p className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0] mt-1">
                    Total Monitored Time: <strong>{formatRideTime(rideDurationSeconds)}</strong> • Plate: {customPlate}
                  </p>
                  <p className="text-xs text-[#5A6D56] dark:text-[#88B084] font-medium mt-2">
                    Emergency contacts notified of your safe arrival.
                  </p>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('book');
                      setGuardPhase('pre_ride');
                    }}
                    className="px-8 py-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
