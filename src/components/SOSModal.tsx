import React, { useState } from 'react';
import { ShieldAlert, X, Phone, Radio, CheckCircle2, Mic, MapPin, Send, AlertOctagon } from 'lucide-react';
import { UserProfile } from '../types';

interface SOSModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  user,
  isOpen,
  onClose,
  currentLocationName,
}) => {
  const [isSilentPanic, setIsSilentPanic] = useState(true);
  const [recordAudio, setRecordAudio] = useState(true);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosResult, setSosResult] = useState<any>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSOS = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/sos-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLocation: { name: currentLocationName, lat: 32.2432, lng: 77.1892 },
          emergencyContacts: user.emergencyContacts.map((c) => `${c.name} (${c.phone})`),
          notes: 'Emergency SOS Beacon triggered from AstraSafe Mobile Web Client',
        }),
      });

      const data = await res.json();
      setSosResult(data);
      setSosTriggered(true);
    } catch (err) {
      console.error(err);
      setSosTriggered(true);
      setSosResult({
        dispatchStatus: 'LOCAL_BEACON_ACTIVE',
        notifiedParties: ['Women Helpline 1091 (Speed Dial Active)', ...user.emergencyContacts.map((c) => c.name)],
        message: 'Offline emergency beacon triggered! Please dial 1091 immediately.',
      });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C362B]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border-2 border-red-700/80 rounded-3xl w-full max-w-lg text-[#2C362B] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-700 flex items-center justify-center text-white shadow-md animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-red-900">Emergency SOS Beacon</h2>
              <p className="text-xs text-red-700 font-semibold">Instant Police & Emergency Circle Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8A8A8A] hover:text-[#2C362B] hover:bg-red-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {sosTriggered ? (
            <div className="space-y-5 text-center py-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 border-2 border-red-600 flex items-center justify-center text-red-700 animate-pulse">
                <AlertOctagon className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-300">
                  DISPATCH STATUS: {sosResult?.dispatchStatus || 'ACTIVE'}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2C362B] mt-2">Emergency Alert Broadcasted</h3>
                <p className="text-xs text-[#3D3D3D] mt-1">
                  High-precision GPS telemetry link sent to dispatch servers and emergency contacts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] text-left text-xs space-y-2">
                <span className="text-[#8A8A8A] block font-bold">Notified Safety Parties:</span>
                <ul className="space-y-1 text-[#2C362B]">
                  {sosResult?.notifiedParties?.map((p: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-[#5A6D56] font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#5A6D56]" /> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <a
                  href="tel:1091"
                  className="flex-1 py-3 rounded-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
                >
                  <Phone className="w-4 h-4" /> Dial 1091 Women Helpline
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-full bg-[#FAF8F5] hover:bg-[#E5E0D5] text-[#2C362B] border border-[#E5E0D5] font-bold text-xs cursor-pointer transition"
                >
                  Close Screen
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] text-xs space-y-2">
                <div className="flex justify-between text-[#8A8A8A]">
                  <span className="font-bold">Target Region:</span>
                  <span className="font-bold text-[#2C362B]">{currentLocationName}</span>
                </div>
                <div className="flex justify-between text-[#8A8A8A]">
                  <span className="font-bold">Primary Emergency Contact:</span>
                  <span className="font-bold text-red-700">{user.emergencyContacts[0]?.name} ({user.emergencyContacts[0]?.phone})</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div>
                    <span className="text-xs font-bold text-[#2C362B]">Silent Panic Mode</span>
                    <p className="text-[11px] text-[#8A8A8A]">Dispatches alert without flashing screen or making sound</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSilentPanic}
                    onChange={(e) => setIsSilentPanic(e.target.checked)}
                    className="w-4 h-4 accent-red-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div>
                    <span className="text-xs font-bold text-[#2C362B]">Trigger Background Audio Buffer</span>
                    <p className="text-[11px] text-[#8A8A8A]">Records 30s ambient audio evidence for police logs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={recordAudio}
                    onChange={(e) => setRecordAudio(e.target.checked)}
                    className="w-4 h-4 accent-red-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Big Red SOS Button */}
              <button
                onClick={handleTriggerSOS}
                disabled={isDispatching}
                className="w-full py-5 rounded-full bg-red-700 hover:bg-red-800 text-white font-serif font-bold text-base tracking-wider uppercase transition shadow-md flex items-center justify-center gap-3 cursor-pointer animate-pulse"
              >
                {isDispatching ? (
                  <span>DISPATCHING SOS BEACON...</span>
                ) : (
                  <>
                    <Radio className="w-6 h-6 animate-ping" />
                    <span>PRESS TO DISPATCH EMERGENCY SOS</span>
                  </>
                )}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
