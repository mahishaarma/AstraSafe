import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  Phone,
  PhoneOff,
  User,
  Clock,
  Volume2,
  VolumeX,
  Mic,
  ShieldAlert,
  X,
  Play,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface FakeCallerPreset {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatar: string;
  voiceGender: 'female' | 'male';
  scriptText: string;
  suggestedUserResponses: string[];
}

const CALLER_PRESETS: FakeCallerPreset[] = [
  {
    id: 'mom',
    name: 'Sunita (Mom)',
    relation: 'Family / Live Tracker',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    voiceGender: 'female',
    scriptText: "Beta, are you in the cab? Did you check if the rear child lock is open? Your brother and I are watching your live GPS broadcast on AstraSafe right now. What is the car number plate?",
    suggestedUserResponses: [
      "Yes Mom, I just got in. The door lock is tested and open from inside.",
      "I already sent you the cab registration number on WhatsApp.",
      "Yes, I shared the live AstraSafe trip link with you and Rohan. See you in 10 minutes!",
    ],
  },
  {
    id: 'police',
    name: 'Inspector Vikram (HP Police)',
    relation: 'Safety Checkpoint Desk',
    phone: '1091 / +91 1902 252326',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    voiceGender: 'male',
    scriptText: "Hello Ananya, this is Inspector Vikram from the Women Police Help Desk at Mall Road. We are tracking your AstraSafe solo traveler itinerary. Are you approaching the checkpoint?",
    suggestedUserResponses: [
      "Yes Inspector, my cab is on the main road and approaching the station.",
      "Everything is fine, the driver is following the GPS route.",
      "Thank you for checking in, see you at the checkpoint.",
    ],
  },
  {
    id: 'friend',
    name: 'Priya (Fellow Traveler)',
    relation: 'Friend / Hotel Lobby',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    voiceGender: 'female',
    scriptText: "Hey babe! Are you in the taxi? We are waiting right at the hotel lobby outside. Send me the driver's name and registration right now!",
    suggestedUserResponses: [
      "Hey Priya! Yes, I just entered the car, sending you the plate right now.",
      "Wait for me outside the main gate, I'll be there in 7 minutes.",
      "Yes, the AstraSafe ride tracker is running.",
    ],
  },
  {
    id: 'hotel',
    name: 'Tara Homestay Reception',
    relation: 'Hotel Host / Concierge',
    phone: '+91 1902 256890',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    voiceGender: 'female',
    scriptText: "Good evening ma'am, this is Maya from Tara Homestay. We have dinner ready and our security team is standing at the driveway to receive your cab.",
    suggestedUserResponses: [
      "Thank you Maya! The cab is 5 minutes away, please keep the gate open.",
      "Yes, I am in the taxi now.",
    ],
  },
];

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FakeCallModal: React.FC<FakeCallModalProps> = ({ isOpen, onClose }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mom');
  const [delaySeconds, setDelaySeconds] = useState<number>(3);
  const [customCallerName, setCustomCallerName] = useState<string>('');
  const [customCallerScript, setCustomCallerScript] = useState<string>('');
  
  // Call simulation lifecycle: 'config' | 'countdown' | 'ringing' | 'connected'
  const [callState, setCallState] = useState<'config' | 'countdown' | 'ringing' | 'connected'>('config');
  const [countdownRemaining, setCountdownRemaining] = useState<number>(3);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringtoneIntervalRef = useRef<any>(null);

  const selectedPreset = CALLER_PRESETS.find((p) => p.id === selectedPresetId) || CALLER_PRESETS[0];

  const activeCaller = selectedPresetId === 'custom'
    ? {
        name: customCallerName || 'Emergency Contact',
        relation: 'Personal Contact',
        phone: '+91 99999 88888',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        scriptText: customCallerScript || "Hey, are you safe in the cab? I'm watching your live location right now.",
        suggestedUserResponses: [
          "Yes, I am in the cab now. Everything is being tracked.",
          "I'm sharing my live trip with you.",
        ],
      }
    : selectedPreset;

  // Synthesize realistic phone ring melody using Web Audio API
  const playRingtoneBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime); // Standard US/UK ring frequency
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);

      // Trigger mobile vibration if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([400, 200, 400, 200]);
      }
    } catch (e) {
      console.warn('Audio ringtone synth fallback', e);
    }
  };

  // Start Call Countdown
  const handleStartFakeCall = () => {
    setCountdownRemaining(delaySeconds);
    setCallState('countdown');
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (callState === 'countdown') {
      if (countdownRemaining <= 0) {
        setCallState('ringing');
      } else {
        timer = setTimeout(() => {
          setCountdownRemaining((prev) => prev - 1);
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [callState, countdownRemaining]);

  // Ringtone interval effect
  useEffect(() => {
    if (callState === 'ringing') {
      playRingtoneBeep();
      ringtoneIntervalRef.current = setInterval(() => {
        playRingtoneBeep();
      }, 2500);
    } else {
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
      }
    }
    return () => {
      if (ringtoneIntervalRef.current) clearInterval(ringtoneIntervalRef.current);
    };
  }, [callState]);

  // Handle Answer Call
  const handleAnswerCall = () => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
    }
    setCallState('connected');
    setCallDurationSeconds(0);

    // Speak caller script using Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeCaller.scriptText);
      utterance.rate = 0.95;
      utterance.pitch = selectedPreset.voiceGender === 'female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Connected Call Duration Timer Effect
  useEffect(() => {
    let timer: any;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // End Call & Reset
  const handleEndCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
    }
    setCallState('config');
    setCallDurationSeconds(0);
  };

  if (!isOpen) return null;

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* 1. CONFIGURATION VIEW */}
      {callState === 'config' && (
        <div className="bg-white border border-[#E5E0D5] text-[#2C362B] rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
          
          <div className="p-5 border-b border-[#E5E0D5] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#5A6D56] text-white flex items-center justify-center shadow-sm">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#2C362B]">
                  Discreet Fake Call Escape Tool
                </h2>
                <p className="text-xs text-[#8A8A8A]">
                  Trigger a realistic incoming call to exit uncomfortable situations safely
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

          <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
            
            {/* Quick Presets Selection */}
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-[#8A8A8A] block">
                Select Caller Profile
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CALLER_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#F0F4EF] border-[#5A6D56] ring-2 ring-[#5A6D56]/30'
                          : 'bg-[#FAF8F5] border-[#E5E0D5] hover:border-[#5A6D56]/50'
                      }`}
                    >
                      <img
                        src={preset.avatar}
                        alt={preset.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#5A6D56]/30 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-[#2C362B] truncate">{preset.name}</div>
                        <div className="text-[10px] text-[#5A6D56] font-medium truncate">{preset.relation}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delay Countdown Timer Options */}
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-[#8A8A8A] block">
                Ring Delay (Gives time to pocket phone or sit naturally)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Instant (3s)', val: 3 },
                  { label: '10 Secs', val: 10 },
                  { label: '30 Secs', val: 30 },
                  { label: '1 Min', val: 60 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setDelaySeconds(item.val)}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      delaySeconds === item.val
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#2C362B] border-[#E5E0D5] hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Caller Voice & Teleprompter Preview Card */}
            <div className="p-4 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#5A6D56] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Caller Voice Script & Escape Dialogue
                </span>
                <span className="text-[10px] text-[#8A8A8A]">Plays out loud on answer</span>
              </div>
              <p className="text-xs text-[#2C362B] italic bg-white p-3 rounded-xl border border-[#E5E0D5]">
                &ldquo;{activeCaller.scriptText}&rdquo;
              </p>
              <p className="text-[11px] text-[#3D3D3D]">
                💡 <em>The call screen will also show suggested responses you can read aloud to establish that someone is actively tracking your cab/location.</em>
              </p>
            </div>

          </div>

          <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF8F5] flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white border border-[#E5E0D5] hover:bg-[#FAF8F5] text-[#2C362B] text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleStartFakeCall}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Arm Fake Call ({delaySeconds}s)</span>
            </button>
          </div>

        </div>
      )}

      {/* 2. COUNTDOWN VIEW */}
      {callState === 'countdown' && (
        <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl w-full max-w-sm p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/40">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h3 className="text-xl font-bold font-serif">Fake Call Armed</h3>
            <p className="text-xs text-slate-400 mt-1">
              Ringing from <strong>{activeCaller.name}</strong> in
            </p>
            <div className="text-5xl font-black font-mono text-amber-400 mt-3">
              {countdownRemaining}s
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              You can keep your phone face down or hold it casually.
            </p>
          </div>

          <button
            onClick={handleEndCall}
            className="w-full py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            Cancel Armed Call
          </button>
        </div>
      )}

      {/* 3. REALISTIC INCOMING CALL SCREEN */}
      {callState === 'ringing' && (
        <div className="bg-slate-950 text-white rounded-3xl w-full max-w-sm p-8 flex flex-col items-center justify-between min-h-[520px] shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200">
          
          <div className="text-center space-y-3 pt-4">
            <span className="text-xs uppercase tracking-widest text-slate-400 block animate-pulse">
              Incoming Call...
            </span>
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
              {activeCaller.name}
            </h2>
            <p className="text-xs text-slate-400">{activeCaller.phone}</p>
          </div>

          <div className="my-auto text-center">
            <div className="relative inline-block">
              <img
                src={activeCaller.avatar}
                alt={activeCaller.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-30" />
            </div>
            <div className="mt-3 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              AstraSafe Trusted Circle
            </div>
          </div>

          {/* Action Buttons: Decline & Accept */}
          <div className="w-full grid grid-cols-2 gap-6 pt-6">
            <button
              onClick={handleEndCall}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-rose-600 group-hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition transform group-hover:scale-105">
                <PhoneOff className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-slate-300">Decline</span>
            </button>

            <button
              onClick={handleAnswerCall}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition transform group-hover:scale-105 animate-bounce">
                <Phone className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-emerald-400 font-serif">Answer</span>
            </button>
          </div>

        </div>
      )}

      {/* 4. REALISTIC ACTIVE CONNECTED CALL SCREEN WITH VOICE & SCRIPT TELEPROMPTER */}
      {callState === 'connected' && (
        <div className="bg-slate-950 text-white rounded-3xl w-full max-w-md p-6 flex flex-col justify-between max-h-[90vh] shadow-2xl border border-slate-800 overflow-y-auto">
          
          {/* Top Call Info */}
          <div className="text-center space-y-1 pb-3 border-b border-slate-800">
            <h3 className="text-xl font-bold font-serif">{activeCaller.name}</h3>
            <div className="text-xs font-mono text-emerald-400 font-bold">
              {formatCallTime(callDurationSeconds)}
            </div>
            <div className="text-[10px] text-slate-400">
              Audio Voice Synthesis Playing Through Speaker
            </div>
          </div>

          {/* Live Teleprompter / Suggested Response Cue Card */}
          <div className="my-4 space-y-3">
            
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" /> What Caller Is Saying Out Loud:
              </span>
              <p className="text-xs text-emerald-100 italic">
                &ldquo;{activeCaller.scriptText}&rdquo;
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Read Aloud to Establish Safety / Cab Inspection:
              </span>
              <div className="space-y-1.5">
                {activeCaller.suggestedUserResponses.map((resp, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-slate-100 flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-bold">💬</span>
                    <span>&ldquo;{resp}&rdquo;</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Call Controls */}
          <div className="pt-2 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`py-3 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-bold border transition cursor-pointer ${
                  isMuted ? 'bg-amber-600/30 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`py-3 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-bold border transition cursor-pointer ${
                  isSpeakerOn ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>Speaker</span>
              </button>

              <button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(activeCaller.scriptText);
                    utterance.rate = 0.95;
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className="py-3 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                title="Repeat audio script"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Replay Voice</span>
              </button>
            </div>

            {/* Big End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
