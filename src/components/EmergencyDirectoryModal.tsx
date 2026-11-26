import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldAlert,
  Search,
  MapPin,
  Clock,
  Shield,
  HeartPulse,
  Mountain,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Car,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { LocalEmergencyContact } from '../types';

interface EmergencyDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string;
  selectedDestinationId: string;
}

export const STATEWIDE_EMERGENCY_HELPLINES: LocalEmergencyContact[] = [
  {
    id: 'hp_em_01',
    title: 'Women Distress Helpline (HP Police)',
    number: '1091',
    alternateNumber: '+91 177 262 1091',
    description: '24/7 immediate police dispatch, escort & rapid response specifically for women in distress across Himachal Pradesh.',
    is24x7: true,
    category: 'women_helpline',
    location: 'Statewide Himachal Pradesh',
    officerInCharge: 'HP Police Central Women Cell',
    address: 'Police Headquarters, Nigam Vihar, Shimla',
    verificationBadge: 'Govt Official 24/7 Helpline',
  },
  {
    id: 'hp_em_02',
    title: 'National Emergency Helpline (ERSS)',
    number: '112',
    alternateNumber: '100',
    description: 'All-in-one unified national emergency number connecting Police, Fire, and Ambulance with automated GPS tracking.',
    is24x7: true,
    category: 'police',
    location: 'All India & Himachal',
    officerInCharge: 'Ministry of Home Affairs & HP ERSS',
    verificationBadge: 'Unified National Dispatch',
  },
  {
    id: 'hp_em_03',
    title: 'State Disaster Management Authority (SDMA) & High Altitude Rescue',
    number: '1077',
    alternateNumber: '+91 177 281 2344',
    description: 'Toll-free mountain disaster line, avalanche warnings, landslide evacuation, and flash flood emergency control.',
    is24x7: true,
    category: 'disaster',
    location: 'Statewide Himachal Pradesh',
    officerInCharge: 'HP Disaster Management Cell',
    address: 'State Emergency Operations Centre, Shimla',
    verificationBadge: 'State Mountain Disaster Desk',
  },
  {
    id: 'hp_em_04',
    title: 'Emergency Medical & Trauma Ambulance (National Health Mission)',
    number: '108',
    alternateNumber: '102',
    description: 'Free 24/7 mountain ambulance dispatch with portable oxygen and paramedic team.',
    is24x7: true,
    category: 'medical',
    location: 'Statewide Himachal Pradesh',
    officerInCharge: 'GVK-EMRI HP Health Services',
    verificationBadge: '24/7 Emergency Ambulance',
  },
  {
    id: 'hp_em_05',
    title: 'Sakhi One-Stop Crisis Center for Women (Kullu & Kangra)',
    number: '181',
    alternateNumber: '+91 1902 225181',
    description: 'Integrated emergency shelter, legal counseling, medical aid, and psycho-social support for women travelers.',
    is24x7: true,
    category: 'crisis_center',
    location: 'Kullu & Kangra Districts',
    officerInCharge: 'Ministry of Women & Child Development',
    verificationBadge: 'One-Stop Crisis Center',
  },
  {
    id: 'hp_em_06',
    title: 'Himachal Tourism 24/7 Tourist Assistance Cell',
    number: '+91 177 265 2561',
    alternateNumber: '+91 177 265 8302',
    description: 'Official assistance for tourist verification, registration queries, permit support, and operator grievances.',
    is24x7: true,
    category: 'tourism_board',
    location: 'HPTDC Shimla & Regional Offices',
    officerInCharge: 'Director Tourism & Civil Aviation HP',
    verificationBadge: 'Official HPTDC Help Desk',
  },
];

export const REGIONAL_EMERGENCY_DIRECTORY: { [destId: string]: LocalEmergencyContact[] } = {
  dest_manali: [
    {
      id: 'manali_01',
      title: 'Manali Police Station - All-Women Help Desk',
      number: '+91 1902 252326',
      alternateNumber: '+91 94180 94100',
      description: 'Dedicated Lady Officer 24/7 desk at Mall Road. Provides night walk escorts and immediate incident resolution.',
      is24x7: true,
      category: 'police',
      location: 'Mall Road, Manali (500m from Bus Stand)',
      officerInCharge: 'Inspector Sunita Sharma (Women Cell Lead)',
      address: 'Police Station Manali, Distt Kullu, HP 175131',
      verificationBadge: 'Police Station Direct Line',
    },
    {
      id: 'manali_02',
      title: 'Kullu High Altitude Mountain Rescue & SDRF Outpost',
      number: '+91 1902 250100',
      alternateNumber: '+91 1902 222727',
      description: 'Specialized high-altitude search team equipped with satellite beacons and mountain evac stretchers.',
      is24x7: true,
      category: 'mountain_rescue',
      location: 'Solang & Rohtang Corridor',
      officerInCharge: 'SDRF Kullu Command Center',
      address: 'Near District Magistrate Office, Kullu',
      verificationBadge: 'HP SDRF Mountain Rescue',
    },
    {
      id: 'manali_03',
      title: 'Kullu District Hospital & 24/7 Emergency Trauma Center',
      number: '+91 1902 222350',
      alternateNumber: '+91 1902 252333',
      description: '24-hour emergency ward, high-altitude pulmonary edema (HAPE) treatment, and female gynaecologist on call.',
      is24x7: true,
      category: 'medical',
      location: 'Hospital Road, Kullu-Manali Link',
      officerInCharge: 'Chief Medical Officer Kullu',
      address: 'Regional Hospital Kullu, HP',
      verificationBadge: '24/7 Govt District Hospital',
    },
    {
      id: 'manali_04',
      title: 'Kullu-Manali Taxi Operators Union 24/7 Women Safety Desk',
      number: '+91 1902 252450',
      alternateNumber: '+91 98160 55432',
      description: 'Prepaid rate verification, GPS vehicle tracking, and driver authentication control room.',
      is24x7: true,
      category: 'taxi_union',
      location: 'Manali Bus Stand Counter',
      officerInCharge: 'Prepaid Taxi Union President Desk',
      verificationBadge: 'Regulated Taxi Union Control',
    },
  ],
  dest_spiti: [
    {
      id: 'spiti_01',
      title: 'Kaza Sub-Divisional Magistrate (SDM) Control Room',
      number: '+91 1906 222201',
      alternateNumber: '+91 1906 222225',
      description: 'Central administrative rescue control for Spiti Valley, road opening updates, and disaster relief.',
      is24x7: true,
      category: 'disaster',
      location: 'Kaza Town, Spiti',
      officerInCharge: 'SDM Kaza Disaster Desk',
      address: 'Mini Secretariat, Kaza, Lahaul & Spiti, HP 172114',
      verificationBadge: 'District Administration Desk',
    },
    {
      id: 'spiti_02',
      title: 'Kaza Police Outpost & Satellite Checkpost',
      number: '+91 1906 222222',
      alternateNumber: '+91 94595 19060',
      description: 'Inner line permit logs, Kunzum Pass traveler check, and satellite SOS receiver station.',
      is24x7: true,
      category: 'police',
      location: 'Kaza Bridge Junction',
      officerInCharge: 'Station House Officer Kaza',
      address: 'Police Station Kaza, Spiti Valley',
      verificationBadge: '24/7 Mountain Checkpost',
    },
    {
      id: 'spiti_03',
      title: 'Kaza Community Health Center & AMS Hyperbaric Oxygen Clinic',
      number: '+91 1906 222212',
      alternateNumber: '+91 1906 222218',
      description: 'High-altitude sickness specialists, oxygen therapy chamber, and emergency air-evacuation coordination.',
      is24x7: true,
      category: 'medical',
      location: 'Main Bazaar, Kaza (3,650m)',
      officerInCharge: 'Medical Officer In-Charge Kaza CHC',
      address: 'Community Health Center Kaza, Spiti',
      verificationBadge: 'High Altitude Medical Center',
    },
    {
      id: 'spiti_04',
      title: 'Border Roads Organisation (BRO) 70 RCC Emergency Post',
      number: '+91 1906 222240',
      alternateNumber: '+91 1906 223400',
      description: 'Snow clearance, landslide rescue machinery, and road restoration on Kunzum & Samdo highways.',
      is24x7: true,
      category: 'mountain_rescue',
      location: 'Losar & Kaza Base',
      officerInCharge: 'BRO Project Deepak Commander',
      verificationBadge: 'BRO High-Altitude Rescue',
    },
  ],
  dest_dharamshala: [
    {
      id: 'dh_01',
      title: 'Kangra District Police All-Women Police Cell',
      number: '+91 1892 222323',
      alternateNumber: '+91 1892 221483',
      description: 'Specialized women protection force with female officers stationed at McLeod Ganj and Dharamkot.',
      is24x7: true,
      category: 'police',
      location: 'Main Square McLeod Ganj & Dharamshala Cantt',
      officerInCharge: 'DSP Women Safety Cell Kangra',
      address: 'Police Post McLeod Ganj, Dharamshala, HP 176219',
      verificationBadge: 'Dedicated Women Police Cell',
    },
    {
      id: 'dh_02',
      title: 'Delek Tibetan Hospital 24/7 Trauma Emergency Ward',
      number: '+91 1892 222053',
      alternateNumber: '+91 1892 223384',
      description: 'Modern emergency care, English/Tibetan/Hindi multi-lingual medical staff, ambulance hotline.',
      is24x7: true,
      category: 'medical',
      location: 'Gangchen Kyishong, Dharamshala',
      officerInCharge: 'Emergency Duty Officer Delek',
      address: 'Delek Hospital, Near Tibetan Library, Dharamshala',
      verificationBadge: 'Hospital & Ambulance Direct',
    },
    {
      id: 'dh_03',
      title: 'Triund & Dhauladhar Mountain Search & Rescue Squad',
      number: '+91 1892 224982',
      alternateNumber: '+91 98160 33990',
      description: 'Forest department and local mountaineering squad for missing trekker search on Triund and Kareri ridge.',
      is24x7: true,
      category: 'mountain_rescue',
      location: 'Dharamkot Trailhead',
      officerInCharge: 'Divisional Forest Officer Dharamshala',
      verificationBadge: 'Dhauladhar Mountain Rescue',
    },
  ],
  dest_kasol: [
    {
      id: 'ks_01',
      title: 'Kasol Police Outpost & Solo Trekker Safety Counter',
      number: '+91 1902 273024',
      alternateNumber: '+91 1902 273100',
      description: 'Mandatory registration point for Kheerganga and Tosh hikers. 24/7 active foot patrols in market.',
      is24x7: true,
      category: 'police',
      location: 'Kasol Bridge Junction, Parvati Valley',
      officerInCharge: 'Sub-Inspector Kasol Post',
      address: 'Kasol Outpost, Manikaran Road, Kullu HP',
      verificationBadge: 'Valley Police Outpost',
    },
    {
      id: 'ks_02',
      title: 'Manikaran Community Health Center & Emergency Dispensary',
      number: '+91 1902 273200',
      alternateNumber: '+91 1902 273250',
      description: 'Emergency trauma care, ambulance dispatch, and burn/injury treatment center.',
      is24x7: true,
      category: 'medical',
      location: 'Manikaran Bazaar (3.5km from Kasol)',
      officerInCharge: 'Medical Officer Manikaran CHC',
      verificationBadge: '24/7 Emergency Health Post',
    },
    {
      id: 'ks_03',
      title: 'Parvati Valley Volunteer Mountain Rescue Marshals',
      number: '+91 1902 273999',
      alternateNumber: '+91 98161 77221',
      description: 'Local vetted guide collective and SDRF volunteers for trail assistance in Tosh, Chalal & Kheerganga.',
      is24x7: true,
      category: 'mountain_rescue',
      location: 'Barshaini & Kasol Base',
      officerInCharge: 'Parvati Mountain Safety Coalition',
      verificationBadge: 'Local Mountain Rescue Marshals',
    },
  ],
};

export const EmergencyDirectoryModal: React.FC<EmergencyDirectoryModalProps> = ({
  isOpen,
  onClose,
  currentLocationName,
  selectedDestinationId,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'statewide' | 'local' | 'police' | 'medical' | 'mountain_rescue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const localContacts = REGIONAL_EMERGENCY_DIRECTORY[selectedDestinationId] || REGIONAL_EMERGENCY_DIRECTORY['dest_manali'];
  const allContacts = [...STATEWIDE_EMERGENCY_HELPLINES, ...localContacts];

  const filteredContacts = allContacts.filter((contact) => {
    // Search query filter
    const matchesSearch =
      contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.number.includes(searchQuery) ||
      contact.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.location && contact.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'statewide') return STATEWIDE_EMERGENCY_HELPLINES.some((s) => s.id === contact.id);
    if (activeFilter === 'local') return localContacts.some((l) => l.id === contact.id);
    if (activeFilter === 'police') return contact.category === 'police' || contact.category === 'women_helpline';
    if (activeFilter === 'medical') return contact.category === 'medical';
    if (activeFilter === 'mountain_rescue') return contact.category === 'mountain_rescue' || contact.category === 'disaster';

    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppShare = (contact: LocalEmergencyContact) => {
    const text = `🚨 *AstraSafe Emergency Helpline Contact*\n\n*${contact.title}*\n📞 Direct: ${contact.number}\n${contact.alternateNumber ? `📱 Alt: ${contact.alternateNumber}\n` : ''}📍 Location: ${contact.location || currentLocationName}\nℹ️ ${contact.description}\n\nShared via AstraSafe Women Solo Travel Safety Network`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5E0D5] text-[#2C362B] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header Banner */}
        <div className="p-5 border-b border-[#E5E0D5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#2C362B] flex items-center gap-2">
                Emergency & Safety Helplines Directory
              </h2>
              <p className="text-xs text-[#8A8A8A]">
                Verified 24/7 Police, Women Distress, Mountain Rescue, & Medical Desks for <span className="text-[#5A6D56] font-bold">{currentLocationName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:1091"
              className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span>Call 1091</span>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E0D5]/50 border border-[#E5E0D5] flex items-center justify-center text-[#8A8A8A] hover:text-[#2C362B] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Priority 1-Tap National Call Strip */}
        <div className="bg-gradient-to-r from-rose-900 to-[#2C362B] text-white p-3.5 px-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <a
            href="tel:1091"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-rose-300 font-bold uppercase block">Women Distress</span>
              <span className="text-base font-black tracking-wider">1091</span>
            </div>
            <Phone className="w-4 h-4 text-rose-300" />
          </a>

          <a
            href="tel:112"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase block">National ERSS</span>
              <span className="text-base font-black tracking-wider">112</span>
            </div>
            <Phone className="w-4 h-4 text-emerald-300" />
          </a>

          <a
            href="tel:1077"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Mountain Rescue</span>
              <span className="text-base font-black tracking-wider">1077</span>
            </div>
            <Mountain className="w-4 h-4 text-amber-300" />
          </a>

          <a
            href="tel:108"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-sky-300 font-bold uppercase block">Ambulance</span>
              <span className="text-base font-black tracking-wider">108</span>
            </div>
            <HeartPulse className="w-4 h-4 text-sky-300" />
          </a>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-[#E5E0D5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emergency lines by name, number, or category..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E0D5] rounded-full text-xs text-[#2C362B] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#5A6D56]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#5A6D56] text-white shadow-xs'
                  : 'bg-white border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
              }`}
            >
              All ({allContacts.length})
            </button>
            <button
              onClick={() => setActiveFilter('police')}
              className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                activeFilter === 'police'
                  ? 'bg-[#5A6D56] text-white shadow-xs'
                  : 'bg-white border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
              }`}
            >
              👮 Police & Women Desks
            </button>
            <button
              onClick={() => setActiveFilter('mountain_rescue')}
              className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                activeFilter === 'mountain_rescue'
                  ? 'bg-[#5A6D56] text-white shadow-xs'
                  : 'bg-white border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
              }`}
            >
              🏔️ Mountain Rescue & BRO
            </button>
            <button
              onClick={() => setActiveFilter('medical')}
              className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                activeFilter === 'medical'
                  ? 'bg-[#5A6D56] text-white shadow-xs'
                  : 'bg-white border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
              }`}
            >
              🏥 Medical & Oxygen
            </button>
          </div>
        </div>

        {/* Scrollable Contacts List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 bg-slate-50/50">
          {filteredContacts.length === 0 ? (
            <div className="py-12 text-center text-[#8A8A8A] space-y-2">
              <ShieldAlert className="w-10 h-10 mx-auto text-[#8A8A8A]/50" />
              <p className="font-bold text-sm">No emergency helplines match your query.</p>
              <p className="text-xs">Try clearing the search filter or calling National Emergency 112.</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id || contact.number}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info Column */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        contact.category === 'women_helpline'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : contact.category === 'police'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : contact.category === 'mountain_rescue' || contact.category === 'disaster'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30'
                      }`}
                    >
                      {contact.category.replace('_', ' ')}
                    </span>

                    {contact.is24x7 && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 24/7 Active
                      </span>
                    )}

                    {contact.verificationBadge && (
                      <span className="text-[10px] font-semibold text-[#5A6D56] flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> {contact.verificationBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#2C362B]">
                    {contact.title}
                  </h3>

                  <p className="text-xs text-[#3D3D3D] leading-relaxed">
                    {contact.description}
                  </p>

                  {contact.location && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A8A8A]">
                      <MapPin className="w-3.5 h-3.5 text-[#5A6D56]" />
                      <span>{contact.location}</span>
                      {contact.officerInCharge && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[#2C362B]">{contact.officerInCharge}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action Column */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E0D5] shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#8A8A8A] font-bold uppercase block">Helpline Number</span>
                    <span className="text-base sm:text-lg font-black text-[#2C362B] font-mono tracking-tight">
                      {contact.number}
                    </span>
                    {contact.alternateNumber && (
                      <span className="text-[10px] text-[#8A8A8A] block font-mono">
                        Alt: {contact.alternateNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(contact.id || contact.number, contact.number)}
                      className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F0F4EF] text-[#2C362B] border border-[#E5E0D5] transition cursor-pointer text-xs font-bold flex items-center gap-1"
                      title="Copy Number"
                    >
                      {copiedId === (contact.id || contact.number) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#8A8A8A]" />
                      )}
                    </button>

                    <button
                      onClick={() => handleWhatsAppShare(contact)}
                      className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F0F4EF] text-[#2C362B] border border-[#E5E0D5] transition cursor-pointer text-xs"
                      title="Share contact on WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#5A6D56]" />
                    </button>

                    <a
                      href={`tel:${contact.number.replace(/\s+/g, '')}`}
                      className="px-4 py-2 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Dial</span>
                    </a>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#8A8A8A]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#5A6D56]" />
            <span>Himachal Pradesh Police & Tourism Safety Verification Compliant</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full border border-[#E5E0D5] bg-white text-[#2C362B] font-bold hover:bg-[#FAF8F5] transition cursor-pointer"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
