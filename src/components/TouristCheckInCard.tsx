import React, { useState } from 'react';
import { FileText, Shield, CheckCircle2, Clock, AlertCircle, Send, MapPin, Building, Award, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface TouristCheckInCardProps {
  user: UserProfile;
  activeDestinationName: string;
  onRegisterSubmit: (data: any) => Promise<any>;
}

export const TouristCheckInCard: React.FC<TouristCheckInCardProps> = ({
  user,
  activeDestinationName,
  onRegisterSubmit,
}) => {
  const [fullName, setFullName] = useState(user.name);
  const [idNumber, setIdNumber] = useState('8832 9102 4410');
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContacts[0]?.phone || '');
  const [destination, setDestination] = useState(activeDestinationName);
  const [trekRoute, setTrekRoute] = useState('Old Manali to Hampta Pass Day Trek');
  const [startDate, setStartDate] = useState('2026-08-10');
  const [endDate, setEndDate] = useState('2026-08-16');
  const [accommodation, setAccommodation] = useState('Log Huts Homestay, Old Manali');
  const [checkInHours, setCheckInHours] = useState(12);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredPass, setRegisteredPass] = useState<any>(
    user.currentTrip?.registeredWithGovt
      ? {
          registrationId: user.currentTrip.registrationId,
          registeredAt: '2026-08-10T09:30:00Z',
          destination: user.currentTrip.destination,
        }
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await onRegisterSubmit({
        fullName,
        idNumber,
        emergencyPhone,
        destination,
        trekRoute,
        startDate,
        endDate,
        accommodationDetails: accommodation,
        checkInTimerHours: checkInHours,
        notifyLocalPolice: true,
      });
      setRegisteredPass(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30 text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#5A6D56]" /> Official HP Tourism & Local Authority Declaration Portal
          </span>
          <span className="text-xs text-[#8A8A8A] font-mono">Disaster Management Board Linked</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C362B]">
          Digital Tourist Safety Registration & Check-In
        </h1>
        <p className="text-xs sm:text-sm text-[#3D3D3D] leading-relaxed">
          Keep local authorities, mountain rescue units, and disaster management boards aware of your itinerary and trek routes in Himachal Pradesh. Automated check-in timers safeguard solo female explorers in high-altitude terrain.
        </p>
      </div>

      {registeredPass ? (
        /* Render Digital Pass Card */
        <div className="bg-white border-2 border-[#5A6D56] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Shield className="w-64 h-64 text-[#5A6D56]" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/30 flex items-center justify-center text-[#5A6D56]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#5A6D56]">
                  Government Tourist Pass Active
                </span>
                <h2 className="text-xl font-serif font-bold text-[#2C362B]">
                  Pass ID: {registeredPass.registrationId}
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30 text-xs font-bold">
              ● Live Check-In Timer: Active (Every 12 Hours)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
              <span className="text-[#8A8A8A] font-bold block">Registered Explorer:</span>
              <span className="font-bold text-[#2C362B] text-sm">{fullName}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
              <span className="text-[#8A8A8A] font-bold block">Destination & Region:</span>
              <span className="font-bold text-[#2C362B] text-sm">{registeredPass.details?.destination || destination}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
              <span className="text-[#8A8A8A] font-bold block">Declared Trek Route:</span>
              <span className="font-bold text-[#5A6D56] text-sm">{registeredPass.details?.trekRoute || trekRoute}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
              <span className="text-[#8A8A8A] font-bold block">Trek / Stay Duration:</span>
              <span className="font-bold text-[#2C362B]">{startDate} to {endDate}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
              <span className="text-[#8A8A8A] font-bold block">Accommodation:</span>
              <span className="font-bold text-[#2C362B]">{accommodation}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
              <span className="text-[#8A8A8A] font-bold block">Local Authority Desk:</span>
              <span className="font-bold text-[#5A6D56]">HP Tourism & Kullu Police</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/30 flex items-start gap-3 text-xs text-[#2C362B]">
            <Clock className="w-5 h-5 text-[#5A6D56] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#5A6D56]">Automated Mountain Check-In Status: </span>
              Your next check-in ping is scheduled in 11 hours 42 minutes. Tapping "I Am Safe" updates your digital log and resets the timer for rescue units.
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => alert('Check-in confirmed! Timer reset for 12 hours.')}
              className="flex-1 py-3 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              ✓ Confirm "I Am Safe" Check-In Ping
            </button>
            <button
              onClick={() => setRegisteredPass(null)}
              className="px-4 py-3 rounded-full bg-[#FAF8F5] hover:bg-[#E5E0D5] text-[#2C362B] border border-[#E5E0D5] font-bold text-xs transition cursor-pointer"
            >
              Update Registration
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-serif font-bold text-[#2C362B] border-b border-[#E5E0D5] pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#5A6D56]" /> New Tourist & Itinerary Declaration Form
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">Explorer Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">Government ID / Passport Number</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">Primary Emergency Contact Phone</label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">Primary Region</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">Declared Trek Route / Excursion</label>
              <input
                type="text"
                required
                value={trekRoute}
                onChange={(e) => setTrekRoute(e.target.value)}
                placeholder="e.g. Solang Valley, Hampta Pass, Kasol to Kheerganga"
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">Accommodation / Homestay Details</label>
              <input
                type="text"
                required
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                placeholder="Homestay name or hotel"
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>

            <div>
              <label className="block text-[#8A8A8A] font-bold mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8A8A8A] font-bold mb-1 text-xs">
              Check-In Frequency (Safety Timer)
            </label>
            <select
              value={checkInHours}
              onChange={(e) => setCheckInHours(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-xs text-[#2C362B] focus:outline-none"
            >
              <option value={6}>Every 6 Hours (High altitude / solo trekking)</option>
              <option value={12}>Every 12 Hours (Standard day excursions)</option>
              <option value={24}>Every 24 Hours (Low risk town stays)</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/20 text-xs text-[#3D3D3D] space-y-1">
            <span className="font-bold text-[#5A6D56] flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Authority Awareness Guarantee
            </span>
            <p className="text-[#8A8A8A]">
              Submitting this form issues a digital token to Himachal Pradesh Tourism Development Corp and local police stations, giving authorities visibility over registered tourist volume without revealing your live exact location to third parties.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Registering Itinerary...</span>
            ) : (
              <>
                <Send className="w-4 h-4" /> Generate Official Govt Tourist Safety Pass
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
};
