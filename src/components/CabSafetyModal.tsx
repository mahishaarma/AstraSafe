import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Bell,
  Navigation,
  PhoneCall,
  ShieldAlert,
  X,
  Clock,
  User,
  Share2,
  Check,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface CabSafetyModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLaunchFakeCall: () => void;
  onTriggerSOS: () => void;
}

export const CabSafetyModal: React.FC<CabSafetyModalProps> = ({
  user,
  isOpen,
  onClose,
  onLaunchFakeCall,
  onTriggerSOS,
}) => {
  // Phase: 'pre_ride' | 'inside_alert' | 'active_ride' | 'ride_completed'
  const [phase, setPhase] = useState<'pre_ride' | 'inside_alert' | 'active_ride' | 'ride_completed'>('pre_ride');
  
  // Pre-Ride Checklist
  const [childLockChecked, setChildLockChecked] = useState<boolean>(false);
  const [plateChecked, setPlateChecked] = useState<boolean>(false);
  const [driverChecked, setDriverChecked] = useState<boolean>(false);
  const [backSeatChecked, setBackSeatChecked] = useState<boolean>(false);
  
  // Inside-Cab Checklist
  const [insideHandleTested, setInsideHandleTested] = useState<boolean>(false);
  const [windowTested, setWindowTested] = useState<boolean>(false);
  const [sharedTripLink, setSharedTripLink] = useState<boolean>(true);

  // Cab Details
  const [cabPlate, setCabPlate] = useState<string>('HP 01 TB 4921');
  const [driverName, setDriverName] = useState<string>('Rajesh Kumar (Kullu Taxi Union #42)');
  const [cabType, setCabType] = useState<string>('Maruti Dzire White (Prepaid Taxi)');
  
  // Live Ride Timer
  const [rideDurationSeconds, setRideDurationSeconds] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Chime sound on inside cab notification trigger
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
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
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

  // When moving to 'inside_alert', trigger audio chime and notification
  const handleEnterCab = () => {
    setPhase('inside_alert');
    playAlertChime();
  };

  // Ride Timer effect
  useEffect(() => {
    let timer: any;
    if (phase === 'active_ride') {
      timer = setInterval(() => {
        setRideDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase]);

  if (!isOpen) return null;

  const allPreRideChecked = childLockChecked && plateChecked && driverChecked && backSeatChecked;
  const allInsideChecked = insideHandleTested && windowTested;

  const formatRideTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5E0D5] text-[#2C362B] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E0D5] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A6D56] text-white flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-[#2C362B]">
                  Cab & Ride Safety Guard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30">
                  Child Lock Protocol
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A]">
                Mandatory pre-entry inspection & instant inside-door test notification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E0D5]/50 border border-[#E5E0D5] flex items-center justify-center text-[#8A8A8A] hover:text-[#2C362B] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* STEP 1: BEFORE SITTING IN THE CAB */}
          {phase === 'pre_ride' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Mandatory Child Lock Warning & Visual Diagram */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-400 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-amber-900 flex items-center gap-2">
                      <span>CRITICAL: Check Rear Door Child Lock BEFORE Entering</span>
                    </h3>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      If the mechanical child lock on the side of the open door is turned ON, you <strong>CANNOT open the door from the inside</strong> in an emergency!
                    </p>
                  </div>
                </div>

                {/* Visual Child Lock Inspection Diagram */}
                <div className="p-4 bg-white rounded-xl border border-amber-300 text-xs text-[#2C362B] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2">
                    <span className="font-bold text-[#5A6D56] uppercase text-[11px] tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> How to Inspect in 3 Seconds:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F0F4EF] text-[#5A6D56] text-[10px] font-bold">
                      Open Door Edge
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E0D5] space-y-1.5">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Unlock className="w-4 h-4 text-emerald-600" />
                        <span>CORRECT (UNLOCKED / UP)</span>
                      </div>
                      <p className="text-[11px] text-[#3D3D3D]">
                        The small metal/plastic switch on the door&apos;s vertical rim is pushed UP or away from the lock symbol. Door opens freely from inside.
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1.5">
                      <div className="font-bold text-rose-800 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-rose-600" />
                        <span>DANGER (CHILD LOCK ENGAGED)</span>
                      </div>
                      <p className="text-[11px] text-rose-900">
                        Switch is pushed DOWN. If you close the door, only people on the outside can let you out. <strong>Flip switch UP before entering!</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cab Identification Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A] block">
                  Active Taxi / Ride Booking Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-[#8A8A8A] uppercase font-bold">Number Plate</label>
                    <input
                      type="text"
                      value={cabPlate}
                      onChange={(e) => setCabPlate(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-[#E5E0D5] rounded-xl font-mono font-bold text-[#2C362B] text-xs focus:outline-none focus:border-[#5A6D56]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8A8A8A] uppercase font-bold">Driver Name / Union #</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-[#E5E0D5] rounded-xl font-bold text-[#2C362B] text-xs focus:outline-none focus:border-[#5A6D56]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8A8A8A] uppercase font-bold">Vehicle Model & Color</label>
                    <input
                      type="text"
                      value={cabType}
                      onChange={(e) => setCabType(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-[#E5E0D5] rounded-xl text-[#2C362B] text-xs focus:outline-none focus:border-[#5A6D56]"
                    />
                  </div>
                </div>
              </div>

              {/* Pre-Entry Interactive Verification Checklist */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C362B] block">
                  Verify Each Item Before Stepping In:
                </span>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={childLockChecked}
                    onChange={(e) => setChildLockChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2C362B]">
                      1. Child Lock Verified OFF (Door Edge Switch Checked)
                    </div>
                    <p className="text-[11px] text-[#8A8A8A]">
                      I visually checked the rear door edge and confirmed the mechanical child lock is in the unlocked position.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plateChecked}
                    onChange={(e) => setPlateChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2C362B]">
                      2. Number Plate Matches Exact Booking ({cabPlate})
                    </div>
                    <p className="text-[11px] text-[#8A8A8A]">
                      Physical registration plate verified on the car bumper.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={driverChecked}
                    onChange={(e) => setDriverChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2C362B]">
                      3. Driver Photo & Name Confirmed ({driverName.split('(')[0]})
                    </div>
                    <p className="text-[11px] text-[#8A8A8A]">
                      Asked driver &ldquo;Who are you picking up?&rdquo; rather than saying your own name first.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backSeatChecked}
                    onChange={(e) => setBackSeatChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2C362B]">
                      4. Rear Floor & Back Seat Inspected
                    </div>
                    <p className="text-[11px] text-[#8A8A8A]">
                      Confirmed backseat and floor are clear with no unauthorized passengers or items.
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleEnterCab}
                  disabled={!allPreRideChecked}
                  className="w-full py-3.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Car className="w-4 h-4" />
                  <span>I Am Sitting in the Cab → Trigger Inside Check Notification</span>
                </button>
                {!allPreRideChecked && (
                  <p className="text-[11px] text-amber-700 text-center mt-2">
                    Please complete all 4 pre-entry checks (especially child lock) to proceed.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* STEP 2: IMMEDIATE NOTIFICATION ALERT AFTER SITTING INSIDE */}
          {phase === 'inside_alert' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* High Priority Inside Cab Notification Prompt */}
              <div className="p-6 rounded-3xl bg-amber-500 text-slate-950 space-y-4 shadow-xl border-2 border-amber-300">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    <Bell className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full">
                      Immediate In-Cab Safety Prompt
                    </span>
                    <h3 className="font-serif font-bold text-xl text-slate-950 mt-1">
                      🔔 Test Inside Door Handle NOW!
                    </h3>
                    <p className="text-xs text-slate-900 font-medium mt-1 leading-relaxed">
                      Now that you are seated inside, immediately pull the inside door latch slightly to confirm the door unlocks smoothly from your seat.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/90 rounded-2xl text-xs text-slate-900 space-y-2 border border-black/10">
                  <div className="font-bold text-[#2C362B]">Inside Door Handle Test Instructions:</div>
                  <ul className="space-y-1 text-[11px] list-disc list-inside">
                    <li>Gently pull the inside chrome/plastic handle.</li>
                    <li>Does the lock knob pop open? If YES: the child lock is confirmed OFF.</li>
                    <li><strong>If NO / handle feels limp:</strong> Instruct the driver immediately: <em>&ldquo;Bhaiya, please unlock the rear door child lock from outside before moving.&rdquo;</em></li>
                  </ul>
                </div>
              </div>

              {/* Inside Checks */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C362B] block">
                  Confirm Inside Cab Readiness:
                </span>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={insideHandleTested}
                    onChange={(e) => setInsideHandleTested(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2C362B]">
                      Inside Door Handle Tested & Opens Freely
                    </div>
                    <p className="text-[11px] text-[#8A8A8A]">
                      I verified I can exit the vehicle independently from my seat.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={windowTested}
                    onChange={(e) => setWindowTested(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#5A6D56] rounded border-[#E5E0D5] focus:ring-[#5A6D56]"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2C362B]">
                      Power Windows & Ventilation Tested
                    </div>
                    <p className="text-[11px] text-[#8A8A8A]">
                      Window button rolls down freely.
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setPhase('active_ride')}
                  disabled={!allInsideChecked}
                  className="w-full py-3.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Start Live Ride Tracking Monitor</span>
                </button>

                <button
                  onClick={onLaunchFakeCall}
                  className="w-full py-3.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#2C362B] border border-[#E5E0D5] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-[#5A6D56]" />
                  <span>Arm Fake Call Escape</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: ACTIVE RIDE MONITOR & LIVE TELEMETRY */}
          {phase === 'active_ride' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Active Ride Banner */}
              <div className="p-5 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6D56]">
                      Active Ride Monitored
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#2C362B] border border-[#E5E0D5]">
                      Child Lock: Verified OFF
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#2C362B] mt-1">
                    {cabPlate} • {cabType}
                  </h3>
                  <p className="text-xs text-[#3D3D3D]">
                    Driver: {driverName}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-[#5A6D56]/20 sm:pl-4">
                  <span className="text-[10px] font-bold uppercase text-[#8A8A8A] block">Ride Duration</span>
                  <div className="text-2xl font-black font-mono text-[#5A6D56]">
                    {formatRideTime(rideDurationSeconds)}
                  </div>
                </div>
              </div>

              {/* Route Corridor Telemetry */}
              <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2C362B] flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-[#5A6D56]" />
                    Live Route Integrity & Deviation Detector
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    On Designated Route (NH-3 Corridor)
                  </span>
                </div>

                <div className="w-full bg-[#FAF8F5] rounded-full h-2 overflow-hidden border border-[#E5E0D5]">
                  <div className="bg-[#5A6D56] h-full rounded-full transition-all duration-500" style={{ width: '65%' }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8A8A8A]">
                  <span>Origin: Mall Road Junction</span>
                  <span>Estimated Arrival in 6 mins</span>
                  <span>Destination: Old Manali Bridge</span>
                </div>
              </div>

              {/* Quick Actions During Ride */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={onLaunchFakeCall}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] hover:border-[#5A6D56] text-[#2C362B] flex flex-col items-center gap-1 text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-[#5A6D56]" />
                  <span>Fake Call Escape</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'AstraSafe Live Ride Tracking',
                        text: `I am currently in cab ${cabPlate} driven by ${driverName}. Child lock checked. Tracking live:`,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      alert('Trip broadcast shared with emergency contacts!');
                    }
                  }}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] hover:border-[#5A6D56] text-[#2C362B] flex flex-col items-center gap-1 text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  <Share2 className="w-4 h-4 text-[#5A6D56]" />
                  <span>Share Live Trip Link</span>
                </button>

                <button
                  onClick={onTriggerSOS}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 flex flex-col items-center gap-1 text-xs font-bold transition cursor-pointer shadow-sm col-span-2 sm:col-span-1"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Emergency SOS</span>
                </button>
              </div>

              {/* Complete Ride Button */}
              <div className="pt-2">
                <button
                  onClick={() => setPhase('ride_completed')}
                  className="w-full py-3 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  I Have Reached Safely • End Ride
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: RIDE COMPLETED SAFELY */}
          {phase === 'ride_completed' && (
            <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#F0F4EF] text-[#5A6D56] mx-auto flex items-center justify-center border border-[#5A6D56]/40 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#5A6D56]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#2C362B]">
                  Ride Completed Safely!
                </h3>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Total Monitored Time: <strong>{formatRideTime(rideDurationSeconds)}</strong> • Plate: {cabPlate}
                </p>
                <p className="text-xs text-[#5A6D56] font-medium mt-2">
                  Emergency contacts notified of your safe arrival.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => {
                    setPhase('pre_ride');
                    setRideDurationSeconds(0);
                    onClose();
                  }}
                  className="px-8 py-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {phase === 'pre_ride' && (
          <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF8F5] flex justify-between items-center text-xs">
            <span className="text-[#8A8A8A]">Himachal Taxi Union Safety Protocol Compliant</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white border border-[#E5E0D5] text-[#2C362B] font-bold hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
