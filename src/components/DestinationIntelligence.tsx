import React, { useState } from 'react';
import {
  ShieldCheck,
  Compass,
  Phone,
  AlertTriangle,
  Info,
  MapPin,
  Clock,
  Wifi,
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building2,
  HeartPulse,
  ShoppingBag,
  Car,
  Home,
  Flame,
  X,
  Fuel,
  Sparkles,
  Map,
  PhoneCall,
  SlidersHorizontal,
  Scale
} from 'lucide-react';
import { DestinationDossier, InfrastructureItem, SafetyAdvisory, AmenityCategory } from '../types';

interface DestinationIntelligenceProps {
  destination: DestinationDossier;
  onReportAdvisory: (newAdv: SafetyAdvisory) => void;
  onOpenMethodologyModal: () => void;
  onOpenOfflineMapModal: () => void;
  onOpenCabSafetyModal: () => void;
  onOpenFakeCallModal: () => void;
  onOpenEmergencyDirectoryModal?: () => void;
}

export const DestinationIntelligence: React.FC<DestinationIntelligenceProps> = ({
  destination,
  onReportAdvisory,
  onOpenMethodologyModal,
  onOpenOfflineMapModal,
  onOpenCabSafetyModal,
  onOpenFakeCallModal,
  onOpenEmergencyDirectoryModal,
}) => {
  const [infraFilter, setInfraFilter] = useState<'all' | AmenityCategory>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(15);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [reportSeverity, setReportSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  // Filter items by category and distance range
  const filteredInfra = destination.infrastructure.filter((item) => {
    const matchesCategory = infraFilter === 'all' || item.category === infraFilter;
    const matchesDistance = item.distanceKm <= maxDistanceKm;
    return matchesCategory && matchesDistance;
  });

  const handleAddReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc) return;

    const newAdvisory: SafetyAdvisory = {
      id: `adv_user_${Date.now()}`,
      destinationId: destination.id,
      type: reportSeverity === 'high' ? 'harassment_alert' : 'weather_hazard',
      title: reportTitle,
      description: reportDesc,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      locationName: reportLocation || destination.name,
      reportedBy: 'AstraSafe Verified Explorer Alert',
      isVerified: true,
      severity: reportSeverity,
      actionableTip: 'Exercise caution and stick to main well-lit routes.',
    };

    onReportAdvisory(newAdvisory);
    setReportTitle('');
    setReportDesc('');
    setReportLocation('');
    setShowAddReportModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner with Destination Intelligence Overview */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E5E0D5] dark:border-[#2C382E] shadow-sm bg-white dark:bg-[#1B241D] transition-colors duration-200">
        <div className="absolute inset-0">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover opacity-15 filter brightness-105 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1B241D] via-white/80 dark:via-[#1B241D]/80 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10 space-y-6">
          
          {/* Top Badges & Quick Action Dock */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] border border-[#5A6D56]/30 text-xs font-bold uppercase tracking-wider">
                {destination.region}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#5A6D56] text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-200" />
                {destination.accreditationBadge}
              </span>
            </div>

            {/* Quick Safety Shortcuts Dock */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenOfflineMapModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084]" />
                <span>Offline Map</span>
              </button>

              <button
                onClick={onOpenCabSafetyModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-900/50 text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Car className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Book Safe Cab</span>
              </button>

              <button
                onClick={onOpenFakeCallModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-rose-50 text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084]" />
                <span>Fake Call</span>
              </button>
            </div>
          </div>

          {/* Title & Overview */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C362B] dark:text-[#EAEFE9] tracking-tight">
              {destination.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#444] dark:text-[#CBD5CB] max-w-3xl leading-relaxed">
              {destination.overview}
            </p>
          </div>

          {/* Key Metric Score Cards */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#777] dark:text-[#9DAFA0]">
                Empirical Safety Indicators ({destination.name})
              </span>
              
              <button
                onClick={onOpenMethodologyModal}
                className="flex items-center gap-1.5 text-xs font-bold text-[#5A6D56] dark:text-[#88B084] hover:underline underline-offset-4 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Inspect 7-Pillar Audit Methodology</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              
              <div
                onClick={onOpenMethodologyModal}
                className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56]/60 transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#777] dark:text-[#9DAFA0] uppercase tracking-wider block">
                    Safety Index
                  </span>
                  <span className="text-[10px] text-[#5A6D56] dark:text-[#88B084] font-bold opacity-0 group-hover:opacity-100 transition">
                    Audit →
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#5A6D56] dark:text-[#88B084]">{destination.safetyIndex}</span>
                  <span className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">/ 10</span>
                </div>
                <p className="text-[10px] text-[#5A6D56] dark:text-[#88B084] font-medium mt-0.5">Top Safe Zone in Region</p>
              </div>

              <div
                onClick={onOpenMethodologyModal}
                className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56]/60 transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#777] dark:text-[#9DAFA0] uppercase tracking-wider block">
                    Night Lighting
                  </span>
                  <span className="text-[10px] text-[#5A6D56] dark:text-[#88B084] font-bold opacity-0 group-hover:opacity-100 transition">
                    Audit →
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#2C362B] dark:text-[#EAEFE9]">{destination.nightSafetyScore}</span>
                  <span className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">/ 10</span>
                </div>
                <p className="text-[10px] text-[#777] dark:text-[#9DAFA0] mt-0.5">Female Patrol Active</p>
              </div>

              <div
                onClick={onOpenMethodologyModal}
                className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56]/60 transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#777] dark:text-[#9DAFA0] uppercase tracking-wider block">
                    Female Comfort
                  </span>
                  <span className="text-[10px] text-[#5A6D56] dark:text-[#88B084] font-bold opacity-0 group-hover:opacity-100 transition">
                    Audit →
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-[#5A6D56] dark:text-[#88B084]">{destination.femaleComfortScore}</span>
                  <span className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">/ 10</span>
                </div>
                <p className="text-[10px] text-[#5A6D56] dark:text-[#88B084] font-medium mt-0.5">Women-Managed Stays</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] shadow-xs">
                <span className="text-[10px] font-bold text-[#777] dark:text-[#9DAFA0] uppercase tracking-wider block flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-[#5A6D56] dark:text-[#88B084]" /> Cell Network
                </span>
                <div className="mt-1 text-xs space-y-0.5">
                  <div className="flex justify-between text-[#444] dark:text-[#CBD5CB]">
                    <span>Jio:</span> <span className="font-bold text-[#5A6D56] dark:text-[#88B084]">{destination.cellNetworkCoverage.jio}</span>
                  </div>
                  <div className="flex justify-between text-[#444] dark:text-[#CBD5CB]">
                    <span>Airtel:</span> <span className="font-bold text-[#5A6D56] dark:text-[#88B084]">{destination.cellNetworkCoverage.airtel}</span>
                  </div>
                  <div className="flex justify-between text-[#444] dark:text-[#CBD5CB]">
                    <span>BSNL:</span> <span className="font-bold text-amber-600 dark:text-amber-400">{destination.cellNetworkCoverage.bsnl}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Why Women Love It & Cultural Norms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F0F4EF] dark:bg-[#202E22] border border-[#5A6D56]/20">
              <h3 className="text-xs font-bold text-[#5A6D56] dark:text-[#88B084] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" /> Why Solo Women Prefer This Destination
              </h3>
              <ul className="space-y-1.5 text-xs text-[#2C362B] dark:text-[#EAEFE9]">
                {destination.whyWomenLoveIt.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#5A6D56] dark:text-[#88B084] font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E]">
              <h3 className="text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" /> Cultural Respect & Terrain Protocol
              </h3>
              <ul className="space-y-1.5 text-xs text-[#555] dark:text-[#B0C0B0]">
                {destination.localCulturalNorms.map((norm, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#5A6D56] dark:text-[#88B084] font-bold">•</span>
                    <span>{norm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Surrounding Infrastructure & Amenities Radar */}
      <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 space-y-6 shadow-sm transition-colors duration-200">
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2C362B] dark:text-[#EAEFE9] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#5A6D56] dark:text-[#88B084]" /> Essential Amenities & Safety Distance Radar
              </h2>
              <p className="text-xs text-[#777] dark:text-[#9DAFA0] mt-0.5">
                Exact range of petrol pumps, 24/7 medical shops, clean washrooms, and police kiosks in {destination.name}
              </p>
            </div>

            {/* Distance Range Filter */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] dark:bg-[#141B15] px-3 py-1.5 rounded-full border border-[#E5E0D5] dark:border-[#2C382E] text-xs">
              <span className="text-[10px] font-bold uppercase text-[#777] dark:text-[#9DAFA0] flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> Max Range:
              </span>
              <div className="flex items-center gap-1">
                {[
                  { label: '500m', val: 0.5 },
                  { label: '1 km', val: 1.0 },
                  { label: '5 km', val: 5.0 },
                  { label: '15 km', val: 15.0 },
                ].map((range) => (
                  <button
                    key={range.val}
                    onClick={() => setMaxDistanceKm(range.val)}
                    className={`px-2.5 py-0.5 rounded-full font-bold transition cursor-pointer text-xs ${
                      maxDistanceKm === range.val
                        ? 'bg-[#5A6D56] text-white shadow-xs'
                        : 'text-[#777] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure Category Filters */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-[#141B15] p-1 rounded-full border border-[#E5E0D5] dark:border-[#2C382E] text-xs overflow-x-auto no-scrollbar">
            <button
              onClick={() => setInfraFilter('all')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                infraFilter === 'all' ? 'bg-[#5A6D56] text-white shadow-xs' : 'text-[#777] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
              }`}
            >
              All Amenities ({destination.infrastructure.length})
            </button>
            <button
              onClick={() => setInfraFilter('petrol_pump')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                infraFilter === 'petrol_pump' ? 'bg-[#5A6D56] text-white shadow-xs' : 'text-[#777] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" /> Petrol & EV
            </button>
            <button
              onClick={() => setInfraFilter('medical_pharmacy')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                infraFilter === 'medical_pharmacy' ? 'bg-[#5A6D56] text-white shadow-xs' : 'text-[#777] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" /> Medical & Pharmacy
            </button>
            <button
              onClick={() => setInfraFilter('washroom')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                infraFilter === 'washroom' ? 'bg-[#5A6D56] text-white shadow-xs' : 'text-[#777] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
              }`}
            >
              <span>🚻 Clean Washrooms</span>
            </button>
            <button
              onClick={() => setInfraFilter('police')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                infraFilter === 'police' ? 'bg-[#5A6D56] text-white shadow-xs' : 'text-[#777] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Police Desks
            </button>
            <button
              onClick={() => setInfraFilter('female_safe_stay')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                infraFilter === 'female_safe_stay' ? 'bg-[#5A6D56] text-white shadow-xs' : 'text-[#777] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
              }`}
            >
              Safe Stays
            </button>
          </div>
        </div>

        {/* Infrastructure Grid */}
        {filteredInfra.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] dark:bg-[#141B15] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] text-xs text-[#8A8A8A] space-y-2">
            <p className="font-bold text-[#2C362B] dark:text-[#EAEFE9]">No amenities found within {maxDistanceKm} km for this category.</p>
            <p>Try widening the distance filter to 5 km or 15 km to view surrounding highway amenities.</p>
            <button
              onClick={() => setMaxDistanceKm(15)}
              className="mt-2 px-4 py-1.5 rounded-full bg-[#5A6D56] text-white font-bold text-xs cursor-pointer"
            >
              Show All Within 15 km
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInfra.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56]/50 transition space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] flex items-center justify-center shrink-0">
                      {item.category === 'petrol_pump' && <Fuel className="w-5 h-5 text-amber-600" />}
                      {item.category === 'washroom' && <span className="text-lg">🚻</span>}
                      {item.category === 'medical_pharmacy' && <HeartPulse className="w-5 h-5 text-emerald-600" />}
                      {item.category === 'hospital' && <HeartPulse className="w-5 h-5 text-emerald-600" />}
                      {item.category === 'police' && <ShieldCheck className="w-5 h-5 text-rose-600" />}
                      {item.category === 'female_safe_stay' && <Home className="w-5 h-5 text-[#5A6D56]" />}
                      {item.category === 'market' && <ShoppingBag className="w-5 h-5 text-[#5A6D56]" />}
                      {item.category === 'transport_hub' && <Car className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm text-[#2C362B] dark:text-[#EAEFE9]">{item.name}</h3>
                        {item.isAllWomenManaged && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5D3C5] dark:bg-[#3D2E24] text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E]">
                            Women Managed
                          </span>
                        )}
                        {item.is24x7 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            24/7 Open
                          </span>
                        )}
                      </div>
                      
                      {/* Distance Badge & Address */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] text-xs font-black border border-[#5A6D56]/30">
                          {item.distanceKm} km away
                        </span>
                        <p className="text-xs text-[#777] dark:text-[#9DAFA0] flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-[#8A8A8A]" /> {item.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded bg-white dark:bg-[#202B22] text-[#5A6D56] dark:text-[#88B084] text-xs font-bold border border-[#E5E0D5] dark:border-[#2C382E] shrink-0">
                    ★ {item.rating}
                  </span>
                </div>

                {/* Safe Features Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.cleanlinessScore && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
                      ✨ Cleanliness {item.cleanlinessScore}/5.0
                    </span>
                  )}
                  {item.womenSafeFeatures.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-[11px] text-[#555] dark:text-[#B0C0B0] font-medium"
                    >
                      ✓ {feature}
                    </span>
                  ))}
                </div>

                {/* Phone & Operating Hours */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5E0D5] dark:border-[#2C382E]">
                  <span className="text-[#777] dark:text-[#9DAFA0] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8A8A8A]" /> {item.operatingHours}
                  </span>
                  <a
                    href={`tel:${item.phone}`}
                    className="text-[#5A6D56] dark:text-[#88B084] hover:text-[#2C362B] dark:hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {item.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Local Emergency Contacts Directory */}
      <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 space-y-4 shadow-sm transition-colors duration-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#2C362B] dark:text-[#EAEFE9] flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#B91C1C]" /> Important Local Emergency Directory ({destination.name})
            </h2>
            <p className="text-xs text-[#777] dark:text-[#9DAFA0] mt-0.5">
              24/7 Police, Women Helpline, High-Altitude Rescue & District Magistrate Contacts
            </p>
          </div>

          {onOpenEmergencyDirectoryModal && (
            <button
              onClick={onOpenEmergencyDirectoryModal}
              className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Full 24/7 Helpline Directory</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {destination.emergencyContacts.map((contact, cIdx) => (
            <div
              key={cIdx}
              className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B91C1C] block">
                  {contact.category.replace('_', ' ')}
                </span>
                <h4 className="font-bold text-sm text-[#2C362B] dark:text-[#EAEFE9] mt-1">{contact.title}</h4>
                <p className="text-xs text-[#777] dark:text-[#9DAFA0] mt-1">{contact.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E0D5] dark:border-[#2C382E] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#B91C1C]">{contact.number}</span>
                <a
                  href={`tel:${contact.number}`}
                  className="px-3 py-1.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition shadow-xs"
                >
                  Dial Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparency Log & Past Mishappenings / Real-Time Community Advisories */}
      <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-6 space-y-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#2C362B] dark:text-[#EAEFE9] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> Historical Safety Log & Community Advisories
            </h2>
            <p className="text-xs text-[#777] dark:text-[#9DAFA0] mt-0.5">
              Full transparency on previous incidents, seasonal weather hazards, and verified police updates
            </p>
          </div>

          <button
            onClick={() => setShowAddReportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5A6D56] text-white text-xs font-bold hover:bg-[#2C362B] transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Report Safety Hazard
          </button>
        </div>

        <div className="space-y-3">
          {destination.advisories.map((adv) => (
            <div
              key={adv.id}
              className={`p-5 rounded-2xl border shadow-xs ${
                adv.severity === 'high'
                  ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                  : 'bg-[#FAF8F5] dark:bg-[#141B15] border-[#E5E0D5] dark:border-[#2C382E]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        adv.severity === 'high'
                          ? 'bg-[#B91C1C] text-white'
                          : adv.severity === 'medium'
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#5A6D56] text-white'
                      }`}
                    >
                      {adv.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#777] dark:text-[#9DAFA0]">{adv.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#2C362B] dark:text-[#EAEFE9] mt-1.5">{adv.title}</h3>
                  <p className="text-xs text-[#555] dark:text-[#B0C0B0] mt-1 leading-relaxed">{adv.description}</p>
                </div>

                {adv.isVerified && (
                  <span className="px-2.5 py-1 rounded-full bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] text-xs font-bold border border-[#5A6D56]/30 shrink-0">
                    Verified Advisory
                  </span>
                )}
              </div>

              {/* Actionable Tip Box */}
              <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] text-xs text-[#2C362B] dark:text-[#EAEFE9] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#5A6D56] dark:text-[#88B084]">Actionable Safety Recommendation: </span>
                  {adv.actionableTip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl w-full max-w-lg p-6 space-y-4 text-[#2C362B] dark:text-[#EAEFE9] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E0D5] dark:border-[#2C382E] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2C362B] dark:text-[#EAEFE9]">Submit Community Safety Advisory</h3>
              <button onClick={() => setShowAddReportModal(false)} className="text-[#8A8A8A] hover:text-[#2C362B] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Advisory Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unlit trail near bridge after 8 PM"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl focus:outline-none focus:border-[#5A6D56]"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Detailed Description & Guidance</label>
                <textarea
                  placeholder="Describe what you observed and what solo women explorers should do..."
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl h-24 focus:outline-none focus:border-[#5A6D56]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Specific Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Old Manali Riverbank"
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl focus:outline-none focus:border-[#5A6D56]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Severity Level</label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#141B15] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl focus:outline-none focus:border-[#5A6D56]"
                  >
                    <option value="low">Low (General Tip / Awareness)</option>
                    <option value="medium">Medium (Seasonal Caution / Route)</option>
                    <option value="high">High (Immediate Warning)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E5E0D5] dark:border-[#2C382E] hover:bg-[#FAF8F5] dark:hover:bg-[#202B22] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#5A6D56] text-white font-bold hover:bg-[#2C362B] shadow-xs cursor-pointer"
                >
                  Broadcast Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
