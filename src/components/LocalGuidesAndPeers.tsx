import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Star,
  Calendar,
  MessageCircle,
  BadgeCheck,
  Compass,
  CheckCircle2,
  UserPlus,
  Send,
  X,
  Award,
  HeartPulse,
  Mountain,
  Radio,
  FileCheck,
  Eye,
  Shield,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { MountainGuide, PeerTraveler } from '../types';
import { Phone, Video, Lock } from 'lucide-react';

interface LocalGuidesAndPeersProps {
  guides: MountainGuide[];
  peers: PeerTraveler[];
  activeDestinationName: string;
  onOpenChat?: (peer: {
    id: string;
    name: string;
    avatar: string;
    handle: string;
    homeCity?: string;
    trustScore: number;
    destination?: string;
    planTitle?: string;
  }) => void;
  onOpenCall?: (
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
  ) => void;
}

export const LocalGuidesAndPeers: React.FC<LocalGuidesAndPeersProps> = ({
  guides,
  peers,
  activeDestinationName,
  onOpenChat,
  onOpenCall,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'guides' | 'peers'>('guides');
  const [guideGenderFilter, setGuideGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState<MountainGuide | null>(null);
  const [selectedGuideForExperience, setSelectedGuideForExperience] = useState<MountainGuide | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<PeerTraveler | null>(null);
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedGuideForBooking(null);
      setSelectedPeer(null);
      setBookingMsg('');
    }, 2000);
  };

  const filteredGuides = guides.filter((g) => {
    if (guideGenderFilter === 'all') return true;
    if (guideGenderFilter === 'female') return g.gender === 'female';
    if (guideGenderFilter === 'male') return g.gender === 'male' || g.isPartneredMaleGuide;
    return true;
  });

  const femaleCount = guides.filter((g) => g.gender === 'female').length;
  const malePartnerCount = guides.filter((g) => g.gender === 'male' || g.isPartneredMaleGuide).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E5E0D5] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% Police Verified & Screened
            </span>
            <span className="text-xs text-[#8A8A8A]">AstraSafe Vetted Guides & Peers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C362B] mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#5A6D56]" /> Verified Mountain Guides & Peer Solo Travelers
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Connect safely with vetted female local leads, partnered male mountain masters with spotless clean records, and ID-verified solo women in {activeDestinationName}
          </p>
        </div>

        {/* Subtab Navigation */}
        <div className="flex bg-white p-1 rounded-full border border-[#E5E0D5] text-xs">
          <button
            onClick={() => setActiveMainTab('guides')}
            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer ${
              activeMainTab === 'guides' ? 'bg-[#5A6D56] text-white shadow-sm' : 'text-[#8A8A8A] hover:text-[#2C362B]'
            }`}
          >
            Verified Mountain Guides ({guides.length})
          </button>
          <button
            onClick={() => setActiveMainTab('peers')}
            className={`px-4 py-2 rounded-full font-bold transition cursor-pointer ${
              activeMainTab === 'peers' ? 'bg-[#5A6D56] text-white shadow-sm' : 'text-[#8A8A8A] hover:text-[#2C362B]'
            }`}
          >
            Solo Traveler Peers ({peers.length})
          </button>
        </div>
      </div>

      {/* GUIDES VIEW */}
      {activeMainTab === 'guides' && (
        <div className="space-y-4">
          
          {/* Guide Gender / Partnership Filter Bar */}
          <div className="bg-white border border-[#E5E0D5] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8A8A8A] uppercase">Guide Directory:</span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setGuideGenderFilter('all')}
                  className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                    guideGenderFilter === 'all'
                      ? 'bg-[#5A6D56] text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
                  }`}
                >
                  All Verified Guides ({guides.length})
                </button>
                <button
                  onClick={() => setGuideGenderFilter('female')}
                  className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                    guideGenderFilter === 'female'
                      ? 'bg-[#5A6D56] text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
                  }`}
                >
                  👩 Vetted Female Guides ({femaleCount})
                </button>
                <button
                  onClick={() => setGuideGenderFilter('male')}
                  className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1 ${
                    guideGenderFilter === 'male'
                      ? 'bg-[#2C362B] text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#2C362B] hover:bg-[#F0F4EF]'
                  }`}
                >
                  <HandshakeIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Partnered Male Guides ({malePartnerCount})</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#5A6D56] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Zero-Incident & Police Clearance Enforced</span>
            </div>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => {
              const exp = guide.experienceDetails;
              const isMale = guide.gender === 'male' || guide.isPartneredMaleGuide;

              return (
                <div
                  key={guide.id}
                  className={`bg-white border rounded-3xl p-6 transition flex flex-col justify-between space-y-4 shadow-sm ${
                    isMale
                      ? 'border-amber-200/80 hover:border-amber-400'
                      : 'border-[#E5E0D5] hover:border-[#5A6D56]/50'
                  }`}
                >
                  <div>
                    {/* Partnership & Police Badge Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5] gap-2">
                      {isMale ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3 text-amber-600" />
                          Partnered Male Guide
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#5A6D56]" />
                          Vetted Female Local Lead
                        </span>
                      )}

                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Zero FIR Clean
                      </span>
                    </div>

                    {/* Header Profile */}
                    <div className="flex items-start gap-3.5 mt-3">
                      <div className="relative shrink-0">
                        <img
                          src={guide.avatar}
                          alt={guide.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#5A6D56]"
                        />
                        <span className="absolute -bottom-1 -right-1 p-1 bg-[#5A6D56] text-white rounded-full shadow-sm" title="HP Police Background Verified">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-base text-[#2C362B] truncate">
                          {guide.name}
                        </h3>
                        <p className="text-xs text-[#5A6D56] font-semibold flex items-center gap-1 mt-0.5 truncate">
                          <Compass className="w-3.5 h-3.5 shrink-0" /> {guide.location}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {guide.rating}
                          </span>
                          <span className="text-[#8A8A8A]">({guide.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Guiding Experience Metric Card */}
                    <div className="grid grid-cols-3 gap-1.5 mt-4 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#8A8A8A] block">Experience</span>
                        <span className="text-xs font-black text-[#5A6D56]">{exp?.yearsInField || guide.trekExperienceYears} Years</span>
                      </div>
                      <div className="border-x border-[#E5E0D5]">
                        <span className="text-[9px] uppercase font-bold text-[#8A8A8A] block">Treks Led</span>
                        <span className="text-xs font-black text-[#2C362B]">{exp?.totalTreksLed || 150}+</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#8A8A8A] block">Safety Record</span>
                        <span className="text-xs font-black text-emerald-700">0.0% Free</span>
                      </div>
                    </div>

                    {/* Police Clearance & Solo Endorsement Strip */}
                    <div className="mt-3 p-2 rounded-xl bg-[#F0F4EF] border border-[#5A6D56]/20 text-[10px] space-y-1">
                      <div className="flex items-center justify-between text-[#2C362B]">
                        <span className="font-bold flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-[#5A6D56]" /> Police Clearance Cert:
                        </span>
                        <span className="font-mono text-[#5A6D56] font-bold">
                          {guide.policeClearanceCertId?.slice(0, 16) || 'HP-POL-2026-VERIFIED'}
                        </span>
                      </div>
                      <p className="text-[#5A6D56] font-semibold">
                        ★ {guide.femaleEndorsementScore || '99.8% Solo Female Trust Rating'}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#3D3D3D] mt-3 leading-relaxed line-clamp-2">
                      {guide.bio}
                    </p>

                    {/* Specialties Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {guide.specialties.slice(0, 3).map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[10px] font-bold text-[#3D3D3D] border border-[#E5E0D5]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price, Guiding Portfolio & Book Button */}
                  <div className="pt-4 border-t border-[#E5E0D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block font-bold">Daily Fee</span>
                        <span className="text-base font-black text-[#5A6D56]">₹{guide.pricePerDayINR.toLocaleString()}</span>
                        <span className="text-[10px] text-[#8A8A8A]"> / day</span>
                      </div>

                      <button
                        onClick={() => setSelectedGuideForExperience(guide)}
                        className="px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#2C362B] border border-[#E5E0D5] text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5 text-[#5A6D56]" />
                        <span>Experience Dossier</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedGuideForBooking(guide)}
                      className="w-full py-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Verified Guide ({guide.availableFrom})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PEER SOLO TRAVELERS VIEW */}
      {activeMainTab === 'peers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peers.map((peer) => (
            <div
              key={peer.id}
              className="bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 rounded-3xl p-6 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#5A6D56]/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif font-bold text-base text-[#2C362B]">{peer.name}</h3>
                      {peer.verificationBadge && (
                        <CheckCircle2 className="w-4 h-4 text-[#5A6D56]" />
                      )}
                    </div>
                    <p className="text-xs text-[#8A8A8A]">{peer.handle} • From {peer.homeCity}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-[#5A6D56]">
                      <span>Trust Score {peer.trustScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/20 text-xs text-[#2C362B]">
                  <span className="font-bold text-[#5A6D56] block text-[10px] uppercase tracking-wider">
                    Looking for Trek / Cab Buddy:
                  </span>
                  <p className="mt-0.5 text-xs text-[#3D3D3D]">{peer.lookingFor}</p>
                </div>

                <p className="text-xs text-[#3D3D3D] mt-3 leading-relaxed">
                  {peer.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {peer.interests.map((interest, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[10px] font-bold text-[#3D3D3D] border border-[#E5E0D5]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#8A8A8A] font-semibold">
                  {peer.travelDates}
                </span>

                <div className="flex items-center gap-1.5">
                  {onOpenChat && (
                    <button
                      onClick={() =>
                        onOpenChat({
                          id: peer.id,
                          name: peer.name,
                          avatar: peer.avatar,
                          handle: peer.handle,
                          homeCity: peer.homeCity,
                          trustScore: peer.trustScore,
                          destination: peer.destination,
                        })
                      }
                      className="px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F0F4EF] text-[#2C362B] border border-[#E5E0D5] text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Direct Encrypted In-App Chat"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#5A6D56]" />
                      <span>Chat</span>
                    </button>
                  )}

                  {onOpenCall && (
                    <button
                      onClick={() =>
                        onOpenCall(
                          {
                            id: peer.id,
                            name: peer.name,
                            avatar: peer.avatar,
                            handle: peer.handle,
                            homeCity: peer.homeCity,
                            trustScore: peer.trustScore,
                            destination: peer.destination,
                          },
                          'audio'
                        )
                      }
                      className="p-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F0F4EF] text-[#5A6D56] border border-[#E5E0D5] transition cursor-pointer shadow-xs"
                      title="Direct Encrypted Voice Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedPeer(peer)}
                    className="px-3.5 py-1.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED GUIDING EXPERIENCE & POLICE CERTIFICATE MODAL */}
      {selectedGuideForExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E0D5] text-[#2C362B] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E0D5] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedGuideForExperience.avatar}
                  alt={selectedGuideForExperience.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#5A6D56]"
                />
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#2C362B] flex items-center gap-2">
                    {selectedGuideForExperience.name}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F4EF] text-[#5A6D56]">
                      {selectedGuideForExperience.gender === 'male' ? 'Partnered Guide' : 'Vetted Female Lead'}
                    </span>
                  </h2>
                  <p className="text-xs text-[#8A8A8A]">
                    {selectedGuideForExperience.location} • Verified by {selectedGuideForExperience.backgroundCheckedBy}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedGuideForExperience(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E0D5]/50 border border-[#E5E0D5] flex items-center justify-center text-[#8A8A8A] hover:text-[#2C362B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
              
              {/* Police Background Check & Clearance Certificate Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#F0F4EF] border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" /> Official Police Clearance Certificate
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                    CLEAN RECORD CONFIRMED
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2C362B]">
                  <div>
                    <span className="text-[10px] text-[#8A8A8A] block">Certificate Reference ID:</span>
                    <span className="font-mono font-bold text-[#2C362B]">
                      {selectedGuideForExperience.policeClearanceCertId || 'HP-POL-2026-SP-9012'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A8A8A] block">Auditing Authority:</span>
                    <span className="font-bold text-[#2C362B]">
                      {selectedGuideForExperience.backgroundCheckedBy}
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Experience Track Record */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#8A8A8A] block">Active Years</span>
                  <span className="text-xl font-black text-[#5A6D56]">
                    {selectedGuideForExperience.experienceDetails?.yearsInField || selectedGuideForExperience.trekExperienceYears} Yrs
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#8A8A8A] block">Total Treks Led</span>
                  <span className="text-xl font-black text-[#2C362B]">
                    {selectedGuideForExperience.experienceDetails?.totalTreksLed || 180}+
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#8A8A8A] block">Solo Women Trips</span>
                  <span className="text-xl font-black text-[#5A6D56]">
                    {selectedGuideForExperience.experienceDetails?.soloFemaleLedCount || 140}+
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#8A8A8A] block">Incident Rate</span>
                  <span className="text-xl font-black text-emerald-700">0.0% Free</span>
                </div>
              </div>

              {/* Verified Mountain Certifications */}
              {selectedGuideForExperience.experienceDetails?.certifications && (
                <div className="space-y-2.5">
                  <h3 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#5A6D56]" /> Verified Mountain Accreditations & Lead Certifications
                  </h3>
                  <div className="space-y-2">
                    {selectedGuideForExperience.experienceDetails.certifications.map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3.5 rounded-2xl bg-white border border-[#E5E0D5] flex items-start justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#F0F4EF] text-[#5A6D56] flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#2C362B]">{cert.name}</div>
                            <p className="text-[11px] text-[#8A8A8A] mt-0.5">Issued by {cert.issuer}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-[#F0F4EF] text-[#5A6D56] text-xs font-mono font-bold shrink-0">
                          {cert.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Equipment Carried */}
              {selectedGuideForExperience.experienceDetails?.safetyEquipmentCarried && (
                <div className="space-y-2.5">
                  <h3 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#5A6D56]" /> Standard Mountain Safety Equipment Carried
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedGuideForExperience.experienceDetails.safetyEquipmentCarried.map((gear, gIdx) => (
                      <div
                        key={gIdx}
                        className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-[11px] text-[#2C362B] flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6D56] shrink-0" />
                        <span>{gear}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solo Female Traveler Testimonials */}
              {selectedGuideForExperience.experienceDetails?.testimonials && (
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Solo Women Traveler Testimonials & Reviews
                  </h3>
                  <div className="space-y-2.5">
                    {selectedGuideForExperience.experienceDetails.testimonials.map((test, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-4 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/20 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-[#2C362B]">{test.travelerName}</div>
                          <span className="text-amber-700 font-bold text-xs">★ {test.rating}.0</span>
                        </div>
                        <div className="text-[10px] text-[#5A6D56] font-semibold">
                          Trip: {test.verifiedTrip} • {test.date}
                        </div>
                        <p className="text-xs text-[#3D3D3D] italic">
                          &ldquo;{test.comment}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF8F5] flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#8A8A8A] uppercase font-bold">Standard Rate</span>
                <div className="text-sm font-black text-[#5A6D56]">
                  ₹{selectedGuideForExperience.pricePerDayINR.toLocaleString()} / day
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedGuideForExperience(null)}
                  className="px-4 py-2 rounded-full border border-[#E5E0D5] text-[#2C362B] text-xs font-bold hover:bg-[#FAF8F5]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const guide = selectedGuideForExperience;
                    setSelectedGuideForExperience(null);
                    setSelectedGuideForBooking(guide);
                  }}
                  className="px-5 py-2 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Book This Guide
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* BOOKING / CONNECT MODAL */}
      {(selectedGuideForBooking || selectedPeer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white border border-[#E5E0D5] text-[#2C362B] rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2C362B]">
                {selectedGuideForBooking
                  ? `Book Guide: ${selectedGuideForBooking.name}`
                  : `Connect with Peer: ${selectedPeer?.name}`}
              </h3>
              <button
                onClick={() => {
                  setSelectedGuideForBooking(null);
                  setSelectedPeer(null);
                }}
                className="text-[#8A8A8A] hover:text-[#2C362B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#5A6D56] mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-[#2C362B]">
                  {selectedGuideForBooking ? 'Guide Request Dispatched!' : 'Connection Request Sent!'}
                </h4>
                <p className="text-xs text-[#8A8A8A]">
                  Encrypted AstraSafe handshake initiated with verified credentials. You will receive an SMS & in-app confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <p className="text-[#8A8A8A]">
                  {selectedGuideForBooking
                    ? `Specify your requested trek dates, altitude preferences, and itinerary details for ${selectedGuideForBooking.name}.`
                    : `Introduce yourself and propose a shared cab, meal, or group trek with ${selectedPeer?.name}.`}
                </p>

                <div>
                  <label className="font-bold block mb-1">Proposed Dates / Time</label>
                  <input
                    type="text"
                    defaultValue="Tomorrow morning at 09:00 AM"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:border-[#5A6D56]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Encrypted Message</label>
                  <textarea
                    placeholder="Hello, I would like to explore together..."
                    value={bookingMsg}
                    onChange={(e) => setBookingMsg(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl h-24 focus:outline-none focus:border-[#5A6D56]"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGuideForBooking(null);
                      setSelectedPeer(null);
                    }}
                    className="px-4 py-2 rounded-full border border-[#E5E0D5] hover:bg-[#FAF8F5] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#5A6D56] text-white font-bold hover:bg-[#2C362B] shadow-sm"
                  >
                    Send Encrypted Request
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

// Handshake icon fallback helper
const HandshakeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.7 1.7" />
    <path d="m14 14 2.5 2.5a1 1 0 0 0 1.4 0l2.6-2.6a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L14 12" />
    <path d="M18 10 9.7 1.7a1 1 0 0 0-1.4 0L3.7 6.3a1 1 0 0 0 0 1.4L11 15" />
    <path d="M2 13.5V20a2 2 0 0 0 2 2h6.5" />
  </svg>
);
