import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  Video,
  ShieldCheck,
  Lock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  MapPin,
  Clock,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Camera,
  CameraOff
} from 'lucide-react';
import { DirectChatMessage, DirectCallState, UserProfile } from '../types';

interface DirectChatAndCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  activeChatPeer: {
    id: string;
    name: string;
    avatar: string;
    handle: string;
    homeCity?: string;
    trustScore: number;
    destination?: string;
    planTitle?: string;
  } | null;
  initialCallMode?: 'audio' | 'video' | null;
}

export const DirectChatAndCallModal: React.FC<DirectChatAndCallModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeChatPeer,
  initialCallMode = null,
}) => {
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [callState, setCallState] = useState<DirectCallState | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioTimer, setAudioTimer] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize or load conversation
  useEffect(() => {
    if (!activeChatPeer) return;

    // Sample initial thread
    const peerId = activeChatPeer.id;
    const initialThread: DirectChatMessage[] = [
      {
        id: `msg_seed_1_${peerId}`,
        senderId: peerId,
        senderName: activeChatPeer.name,
        senderAvatar: activeChatPeer.avatar,
        recipientId: currentUser.id,
        text: `Hi ${currentUser.name}! Saw your verified profile on AstraSafe. Excited to connect and coordinate plans safely!`,
        timestamp: 'Just now',
        isEncrypted: true,
        status: 'read',
      },
    ];

    if (activeChatPeer.planTitle) {
      initialThread.push({
        id: `msg_seed_2_${peerId}`,
        senderId: peerId,
        senderName: activeChatPeer.name,
        senderAvatar: activeChatPeer.avatar,
        recipientId: currentUser.id,
        text: `Regarding our plan: "${activeChatPeer.planTitle}". What time works best for you?`,
        timestamp: 'Just now',
        isEncrypted: true,
        status: 'read',
      });
    }

    setMessages(initialThread);

    // If launched with call mode
    if (initialCallMode) {
      startCall(initialCallMode);
    }
  }, [activeChatPeer, initialCallMode]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, callState]);

  // Call timer interval
  useEffect(() => {
    let interval: any = null;
    if (callState && callState.callStatus === 'connected') {
      interval = setInterval(() => {
        setCallState((prev) => (prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState?.callStatus]);

  // Ringing timeout simulation -> auto connect after 2.5 seconds
  useEffect(() => {
    let ringTimeout: any = null;
    if (callState && callState.callStatus === 'ringing') {
      ringTimeout = setTimeout(() => {
        setCallState((prev) => (prev ? { ...prev, callStatus: 'connected' } : null));
      }, 2500);
    }
    return () => {
      if (ringTimeout) clearTimeout(ringTimeout);
    };
  }, [callState?.callStatus]);

  if (!isOpen || !activeChatPeer) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: DirectChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId: activeChatPeer.id,
      text: inputText.trim(),
      timestamp: 'Just now',
      isEncrypted: true,
      status: 'delivered',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated reply after 1.5s
    setTimeout(() => {
      const replies = [
        `Sounds wonderful! Looking forward to meeting up safely.`,
        `Perfect! I will be at the entrance with my AstraSafe verified badge.`,
        `Got it! Let me know if you need to split the taxi fare via UPI.`,
        `Great! Let us confirm tomorrow morning before heading out.`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_reply_${Date.now()}`,
          senderId: activeChatPeer.id,
          senderName: activeChatPeer.name,
          senderAvatar: activeChatPeer.avatar,
          recipientId: currentUser.id,
          text: randomReply,
          timestamp: 'Just now',
          isEncrypted: true,
          status: 'read',
        },
      ]);
    }, 1500);
  };

  const handleSendQuickPreset = (preset: string) => {
    setInputText(preset);
  };

  const handleShareLocation = () => {
    const locMsg: DirectChatMessage = {
      id: `msg_loc_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId: activeChatPeer.id,
      text: `📍 Shared Safe Check-in Landmark: Cafe & Police Outpost Area (${activeChatPeer.destination || 'Current Location'})`,
      timestamp: 'Just now',
      isEncrypted: true,
      status: 'delivered',
      locationShared: {
        name: `AstraSafe Verified Meetup Hub - ${activeChatPeer.destination || 'Himachal Trail'}`,
        coordinates: '32.2190° N, 76.3234° E',
      },
    };
    setMessages((prev) => [...prev, locMsg]);
  };

  const handleSendVoiceNote = () => {
    setIsRecordingAudio(true);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setAudioTimer(count);
      if (count >= 3) {
        clearInterval(interval);
        setIsRecordingAudio(false);
        setAudioTimer(0);
        // Dispatch audio note
        const voiceMsg: DirectChatMessage = {
          id: `msg_voice_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          recipientId: activeChatPeer.id,
          text: '🎙️ Encrypted Voice Note (0:04s)',
          timestamp: 'Just now',
          isEncrypted: true,
          status: 'delivered',
          audioNoteDuration: '0:04',
        };
        setMessages((prev) => [...prev, voiceMsg]);
      }
    }, 1000);
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallState({
      isActive: true,
      recipient: {
        id: activeChatPeer.id,
        name: activeChatPeer.name,
        avatar: activeChatPeer.avatar,
        handle: activeChatPeer.handle,
        location: activeChatPeer.homeCity || 'Himachal Pradesh',
        trustScore: activeChatPeer.trustScore,
      },
      callType: type,
      callStatus: 'ringing',
      durationSeconds: 0,
      isMuted: false,
      isSpeaker: true,
      isVideoOn: type === 'video',
      isEncrypted: true,
    });
  };

  const endCall = () => {
    if (callState) {
      // Add call log to chat
      const durationFormatted = formatDuration(callState.durationSeconds);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_call_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          recipientId: activeChatPeer.id,
          text: `📞 In-App Encrypted ${callState.callType === 'video' ? 'Video' : 'Voice'} Call ended (${durationFormatted || 'Ringing'})`,
          timestamp: 'Just now',
          isEncrypted: true,
          status: 'delivered',
        },
      ]);
    }
    setCallState(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] text-[#2C362B] dark:text-[#EAEFE9] rounded-3xl w-full max-w-xl h-[88vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden relative">

        {/* ========================================================================= */}
        {/* IN-APP VOICE / VIDEO CALL OVERLAY SCREEN                                 */}
        {/* ========================================================================= */}
        {callState && (
          <div className="absolute inset-0 z-40 bg-gradient-to-b from-[#1E2922] via-[#141E17] to-[#0D140F] text-white flex flex-col justify-between p-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Call Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  P2P 256-Bit Encrypted Call
                </span>
                <span className="text-[10px] text-[#A2B5A5] hidden sm:inline">Zero Phone # Shared</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                  {callState.callStatus === 'ringing' ? 'Calling...' : formatDuration(callState.durationSeconds)}
                </span>
              </div>
            </div>

            {/* Call Center Profile / Video Screen */}
            <div className="my-auto text-center space-y-4">
              <div className="relative inline-block mx-auto">
                <img
                  src={callState.recipient.avatar}
                  alt={callState.recipient.name}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 ${
                    callState.callStatus === 'connected' ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-white/20'
                  } mx-auto transition-all`}
                />
                {callState.callStatus === 'connected' && (
                  <span className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-full shadow-md animate-pulse">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-serif font-bold text-2xl text-white">
                  {callState.recipient.name}
                </h3>
                <p className="text-xs text-[#A2B5A5] mt-0.5">
                  {callState.recipient.handle} • From {callState.recipient.location}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-0.5 rounded-full">
                    AstraSafe Trust Score {callState.recipient.trustScore}%
                  </span>
                </div>
              </div>

              {/* Call Status & Audio Wave Animation */}
              <div className="pt-2">
                {callState.callStatus === 'ringing' ? (
                  <p className="text-xs text-amber-300 font-semibold animate-pulse flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Ringing verified explorer...
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-1 h-6">
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-6 delay-75" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4 delay-150" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-5 delay-100" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2 delay-200" />
                    </div>
                    <p className="text-[11px] text-[#A2B5A5]">
                      Secure Peer-to-Peer Line Active • No Telephony Recording
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Call Control Actions Toolbar */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 pb-2">
              
              {/* Mute Button */}
              <button
                onClick={() => setCallState((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))}
                className={`w-13 h-13 rounded-full flex items-center justify-center text-white transition cursor-pointer ${
                  callState.isMuted ? 'bg-rose-600 hover:bg-rose-700' : 'bg-white/15 hover:bg-white/25 border border-white/20'
                }`}
                title={callState.isMuted ? 'Unmute' : 'Mute'}
              >
                {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Speaker Button */}
              <button
                onClick={() => setCallState((prev) => (prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null))}
                className={`w-13 h-13 rounded-full flex items-center justify-center text-white transition cursor-pointer ${
                  callState.isSpeaker ? 'bg-white/25 border border-white/30 text-emerald-300' : 'bg-white/10 text-white/60'
                }`}
                title={callState.isSpeaker ? 'Speaker On' : 'Speaker Off'}
              >
                {callState.isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Video Toggle Button */}
              <button
                onClick={() => setCallState((prev) => (prev ? { ...prev, isVideoOn: !prev.isVideoOn } : null))}
                className={`w-13 h-13 rounded-full flex items-center justify-center text-white transition cursor-pointer ${
                  callState.isVideoOn ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/15 hover:bg-white/25 border border-white/20'
                }`}
                title={callState.isVideoOn ? 'Camera Active' : 'Enable Camera'}
              >
                {callState.isVideoOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* DIRECT CHAT HEADER                                                       */}
        {/* ========================================================================= */}
        <div className="p-4 border-b border-[#E5E0D5] dark:border-[#2C382E] bg-[#FAF8F5] dark:bg-[#202B22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeChatPeer.avatar}
                alt={activeChatPeer.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-[#5A6D56]"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1B241D]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#2C362B] dark:text-[#EAEFE9]">
                  {activeChatPeer.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> ID Verified
                </span>
              </div>
              <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                {activeChatPeer.handle} • Trust Score {activeChatPeer.trustScore}% • {activeChatPeer.homeCity}
              </p>
            </div>
          </div>

          {/* Call Trigger Actions & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => startCall('audio')}
              className="p-2.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E] transition cursor-pointer shadow-xs"
              title="Start Encrypted Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={() => startCall('video')}
              className="p-2.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E] transition cursor-pointer shadow-xs"
              title="Start Encrypted Video Call"
            >
              <Video className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-[#E5E0D5]/50 dark:hover:bg-[#2C382E] text-[#8A8A8A] hover:text-[#2C362B] dark:hover:text-white transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Encryption & Safety Banner */}
        <div className="px-4 py-2 bg-[#F0F4EF] dark:bg-[#223024] border-b border-[#5A6D56]/20 dark:border-[#2C382E] text-[11px] text-[#5A6D56] dark:text-[#88B084] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">End-to-End Encrypted AstraSafe Female Peer Connection</span>
          </div>
          <span className="text-[10px] font-mono text-[#8A8A8A] dark:text-[#9DAFA0] hidden sm:inline">
            Zero Telemetry Logged
          </span>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]/40 dark:bg-[#161E17]">
          {activeChatPeer.planTitle && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-[#2A2B20] border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-700 dark:text-amber-400">
                Connected via Free Day Itinerary Plan:
              </span>
              <p className="font-semibold">{activeChatPeer.planTitle}</p>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                    isMe
                      ? 'bg-[#5A6D56] text-white rounded-br-none'
                      : 'bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-[#2C362B] dark:text-[#EAEFE9] rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {msg.locationShared && (
                    <div className="mt-2 p-2.5 rounded-xl bg-black/10 dark:bg-black/30 border border-white/10 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{msg.locationShared.name}</span>
                      </div>
                      {msg.locationShared.coordinates && (
                        <span className="text-[10px] font-mono opacity-80 block">
                          GPS: {msg.locationShared.coordinates}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0] mt-1 px-1 flex items-center gap-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCircle2 className="w-3 h-3 text-[#5A6D56] dark:text-[#88B084]" />}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Safety & Coordination Chips */}
        <div className="p-2 bg-[#FAF8F5] dark:bg-[#1E2720] border-t border-[#E5E0D5] dark:border-[#2C382E] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => handleSendQuickPreset("Let's meet at a well-lit cafe near Mall Road.")}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-[#253327] border border-[#E5E0D5] dark:border-[#2C382E] text-[10px] font-bold text-[#5A6D56] dark:text-[#88B084] whitespace-nowrap hover:bg-[#F0F4EF] cursor-pointer"
          >
            ☕ Meet at public cafe
          </button>
          <button
            onClick={handleShareLocation}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-[#253327] border border-[#E5E0D5] dark:border-[#2C382E] text-[10px] font-bold text-[#5A6D56] dark:text-[#88B084] whitespace-nowrap hover:bg-[#F0F4EF] cursor-pointer flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" /> Share check-in spot
          </button>
          <button
            onClick={() => handleSendQuickPreset("I can split the taxi fare via UPI right away!")}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-[#253327] border border-[#E5E0D5] dark:border-[#2C382E] text-[10px] font-bold text-[#5A6D56] dark:text-[#88B084] whitespace-nowrap hover:bg-[#F0F4EF] cursor-pointer"
          >
            🚕 Split cab via UPI
          </button>
          <button
            onClick={() => handleSendQuickPreset("Let's plan to return back before 5:30 PM.")}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-[#253327] border border-[#E5E0D5] dark:border-[#2C382E] text-[10px] font-bold text-[#5A6D56] dark:text-[#88B084] whitespace-nowrap hover:bg-[#F0F4EF] cursor-pointer"
          >
            ☀️ Return before dark
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-[#E5E0D5] dark:border-[#2C382E] bg-white dark:bg-[#1B241D] flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={handleSendVoiceNote}
            className={`p-2.5 rounded-full border transition cursor-pointer ${
              isRecordingAudio
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-[#FAF8F5] dark:bg-[#202B22] border-[#E5E0D5] dark:border-[#2C382E] text-[#5A6D56] dark:text-[#88B084] hover:bg-[#F0F4EF]'
            }`}
            title="Send Encrypted Audio Note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={isRecordingAudio ? `Recording audio note (${audioTimer}s)...` : `Message ${activeChatPeer.name.split(' ')[0]} privately...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecordingAudio}
            className="flex-1 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isRecordingAudio}
            className="p-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] dark:hover:bg-[#445641] disabled:opacity-40 text-white transition cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
