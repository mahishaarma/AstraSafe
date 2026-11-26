import React, { useState } from 'react';
import {
  Calendar,
  Users,
  MessageCircle,
  Phone,
  Video,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Coffee,
  Mountain,
  Car,
  Compass,
  Sparkles,
  ShieldCheck,
  Tag,
  DollarSign,
  Heart,
  Share2,
  X,
  Lock,
  UserCheck
} from 'lucide-react';
import { FreeDayPlan, PlanCategory, UserProfile } from '../types';

interface TravelBuddyPlansProps {
  plans: FreeDayPlan[];
  setPlans: React.Dispatch<React.SetStateAction<FreeDayPlan[]>>;
  currentUser: UserProfile;
  activeDestinationId: string;
  activeDestinationName: string;
  destinations: { id: string; name: string }[];
  onOpenChat: (peer: {
    id: string;
    name: string;
    avatar: string;
    handle: string;
    homeCity?: string;
    trustScore: number;
    destination?: string;
    planTitle?: string;
  }) => void;
  onOpenCall: (
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

const CATEGORY_META: Record<
  PlanCategory,
  { label: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  cafe_work: { label: 'Cafe & Cowork', icon: Coffee, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' },
  sunset_hike: { label: 'Sunset Hike', icon: Mountain, color: 'text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300' },
  cab_split: { label: 'Taxi / Cab Split', icon: Car, color: 'text-blue-800 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300' },
  monastery_art: { label: 'Monasteries & Art', icon: Compass, color: 'text-purple-800 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300' },
  food_walk: { label: 'Local Food Walk', icon: Sparkles, color: 'text-rose-800 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300' },
  shopping_chill: { label: 'Handicrafts & Chill', icon: Tag, color: 'text-teal-800 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-300' },
  sunrise_yoga: { label: 'Sunrise Yoga', icon: Heart, color: 'text-orange-800 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300' },
  sightseeing: { label: 'Sightseeing', icon: MapPin, color: 'text-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300' },
};

export const TravelBuddyPlans: React.FC<TravelBuddyPlansProps> = ({
  plans,
  setPlans,
  currentUser,
  activeDestinationId,
  activeDestinationName,
  destinations,
  onOpenChat,
  onOpenCall,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>(activeDestinationId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New plan form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PlanCategory>('cafe_work');
  const [newDestinationId, setNewDestinationId] = useState(activeDestinationId);
  const [newDate, setNewDate] = useState('Tomorrow, Aug 25');
  const [newTimeSlot, setNewTimeSlot] = useState('10:00 AM - 04:00 PM');
  const [newMeetingPoint, setNewMeetingPoint] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMaxBuddies, setNewMaxBuddies] = useState(2);
  const [newEstimatedCost, setNewEstimatedCost] = useState('Pay own cafe bill + split auto');
  const [newSafetyNotes, setNewSafetyNotes] = useState('ID-verified solo women only. Returning before 6 PM.');
  const [newTags, setNewTags] = useState('Cafe Vibe, Co-working, Daylight Return');

  // Filter plans
  const filteredPlans = plans.filter((plan) => {
    if (destinationFilter !== 'all' && plan.destinationId !== destinationFilter) {
      return false;
    }
    if (selectedCategory !== 'all' && plan.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = plan.title.toLowerCase().includes(q);
      const matchDesc = plan.description.toLowerCase().includes(q);
      const matchMeeting = plan.meetingPoint.toLowerCase().includes(q);
      const matchTags = plan.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchMeeting && !matchTags) return false;
    }
    return true;
  });

  const handleJoinPlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          const alreadyJoined = plan.joinedBuddies.some((b) => b.id === currentUser.id);
          if (alreadyJoined) {
            // Leave
            return {
              ...plan,
              joinedBuddies: plan.joinedBuddies.filter((b) => b.id !== currentUser.id),
              status: 'open',
            };
          } else {
            // Join
            const newParticipant = {
              id: currentUser.id,
              name: currentUser.name,
              handle: currentUser.handle,
              avatar: currentUser.avatar,
              homeCity: currentUser.homeCity,
              verified: true,
              trustScore: currentUser.trustScore,
              joinedAt: 'Just now',
            };
            const updatedList = [...plan.joinedBuddies, newParticipant];
            return {
              ...plan,
              joinedBuddies: updatedList,
              status: updatedList.length >= plan.maxBuddies ? 'full' : 'open',
            };
          }
        }
        return plan;
      })
    );

    setSuccessToast('Plan RSVP updated! Encrypted handshake established.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDest = destinations.find((d) => d.id === newDestinationId);

    const createdPlan: FreeDayPlan = {
      id: `plan_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      authorAge: currentUser.age,
      authorHomeCity: currentUser.homeCity,
      authorVerificationBadge: true,
      authorTrustScore: currentUser.trustScore,
      destinationId: newDestinationId,
      destinationName: targetDest ? targetDest.name : activeDestinationName,
      title: newTitle.trim(),
      description: newDescription.trim(),
      date: newDate,
      timeSlot: newTimeSlot,
      category: newCategory,
      meetingPoint: newMeetingPoint.trim() || 'Central Mall Road Police Kiosk Area',
      maxBuddies: Number(newMaxBuddies),
      joinedBuddies: [],
      estimatedCost: newEstimatedCost.trim() || 'Pay own expenses',
      safetyNotes: newSafetyNotes.trim() || 'ID-verified women only.',
      status: 'open',
      createdAt: 'Just now',
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setPlans((prev) => [createdPlan, ...prev]);
    setIsCreateModalOpen(false);
    setSuccessToast('Your Free Day plan is live! Fellow solo women can now request to join and chat.');
    setTimeout(() => setSuccessToast(null), 3500);

    // Reset fields
    setNewTitle('');
    setNewDescription('');
    setNewMeetingPoint('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-800 text-white shadow-xl flex items-center gap-3 border border-emerald-600 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] dark:bg-[#1E2720] border border-[#E5E0D5] dark:border-[#2C382E] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] border border-[#5A6D56]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 100% ID-Verified Women Travel Network
            </span>
            <span className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">Zero Phone Number Exposure</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2C362B] dark:text-[#EAEFE9] mt-1.5 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#5A6D56] dark:text-[#88B084]" />
            Free Day Meetup & Upcoming Itinerary Hangouts
          </h1>
          <p className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0] mt-1 leading-relaxed">
            Have a free day or open afternoon in {activeDestinationName}? Post your planned activity, find fellow solo women explorers, split taxi fares, and coordinate safely through encrypted in-app chat & calls.
          </p>
        </div>

        {/* Post Plan Trigger Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] dark:bg-[#5A6D56] dark:hover:bg-[#435440] text-white text-xs font-bold transition cursor-pointer shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Post My Free Day Plan</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Destination Selector Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8A8A8A] dark:text-[#9DAFA0] uppercase">Location:</span>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-full px-3.5 py-1.5 text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none cursor-pointer"
            >
              <option value="all">All Himalayan Destinations ({plans.length} Plans)</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8A8A8A] dark:text-[#9DAFA0]" />
            <input
              type="text"
              placeholder="Search cafe, Jogini hike, cab split..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-full text-xs text-[#2C362B] dark:text-[#EAEFE9] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#5A6D56]"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-[#8A8A8A] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
            }`}
          >
            All Categories ({plans.length})
          </button>

          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = meta.icon;
            const count = plans.filter((p) => p.category === key).length;
            const isActive = selectedCategory === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#5A6D56] text-white shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-[#8A8A8A] dark:text-[#9DAFA0] hover:text-[#2C362B] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{meta.label}</span>
                {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plans Grid Column */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#2C362B] dark:text-[#EAEFE9]">
            No Free Day Plans Found for This Filter
          </h3>
          <p className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0] max-w-md mx-auto">
            Be the first solo woman explorer to post an itinerary or cafe hangout plan for {activeDestinationName}!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#5A6D56] text-white text-xs font-bold hover:bg-[#2C362B] shadow-sm"
          >
            Post a Plan Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlans.map((plan) => {
            const catMeta = CATEGORY_META[plan.category] || CATEGORY_META.sightseeing;
            const CatIcon = catMeta.icon;
            const isAuthor = plan.authorId === currentUser.id;
            const isJoined = plan.joinedBuddies.some((b) => b.id === currentUser.id);
            const spotsRemaining = plan.maxBuddies - plan.joinedBuddies.length;

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56]/50 rounded-3xl p-6 transition flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  {/* Card Header: Author Profile & Destination Badge */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E0D5] dark:border-[#2C382E]">
                    <div className="flex items-center gap-3">
                      <img
                        src={plan.authorAvatar}
                        alt={plan.authorName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-[#5A6D56]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C362B] dark:text-[#EAEFE9]">
                            {plan.authorName}
                          </h3>
                          {plan.authorVerificationBadge && (
                            <CheckCircle2 className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#8A8A8A] dark:text-[#9DAFA0]">
                          {plan.authorHandle} • From {plan.authorHomeCity}
                        </p>
                        <div className="text-[10px] font-bold text-[#5A6D56] dark:text-[#88B084] mt-0.5">
                          Trust Score {plan.authorTrustScore}%
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 ${catMeta.color}`}>
                      <CatIcon className="w-3 h-3" />
                      {catMeta.label}
                    </span>
                  </div>

                  {/* Destination & Date Banner */}
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] mt-3">
                    <span className="flex items-center gap-1 text-[#5A6D56] dark:text-[#88B084]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> {plan.destinationName}
                    </span>
                    <span className="flex items-center gap-1 text-[#8A8A8A] dark:text-[#9DAFA0]">
                      <Clock className="w-3.5 h-3.5" /> {plan.date} ({plan.timeSlot})
                    </span>
                  </div>

                  {/* Plan Title & Detailed Description */}
                  <h4 className="font-serif font-bold text-base text-[#2C362B] dark:text-[#EAEFE9] mt-2 leading-snug">
                    {plan.title}
                  </h4>
                  <p className="text-xs text-[#3D3D3D] dark:text-[#CBD5CB] mt-2 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Meeting Spot & Cost Estimate Strip */}
                  <div className="mt-3 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] text-xs space-y-2">
                    <div className="flex items-center gap-2 text-[#2C362B] dark:text-[#EAEFE9]">
                      <MapPin className="w-4 h-4 text-[#5A6D56] dark:text-[#88B084] shrink-0" />
                      <span className="font-bold">Meetup:</span>
                      <span className="text-[#3D3D3D] dark:text-[#CBD5CB] truncate">{plan.meetingPoint}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E5E0D5] dark:border-[#2C382E]">
                      <span className="text-[#8A8A8A] dark:text-[#9DAFA0] flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[#5A6D56]" /> {plan.estimatedCost}
                      </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {spotsRemaining > 0 ? `${spotsRemaining} Buddy Spot${spotsRemaining > 1 ? 's' : ''} Open` : 'Group Full'}
                      </span>
                    </div>
                  </div>

                  {/* Joined Buddies Row */}
                  {plan.joinedBuddies.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#8A8A8A] dark:text-[#9DAFA0]">
                        Joined Explorers:
                      </span>
                      <div className="flex items-center -space-x-2">
                        {plan.joinedBuddies.map((buddy) => (
                          <img
                            key={buddy.id}
                            src={buddy.avatar}
                            alt={buddy.name}
                            title={`${buddy.name} (${buddy.handle}) • Trust: ${buddy.trustScore}%`}
                            className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-[#1B241D]"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-[#5A6D56] dark:text-[#88B084]">
                        {plan.joinedBuddies.map((b) => b.name.split(' ')[0]).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {plan.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#202B22] text-[10px] font-bold text-[#3D3D3D] dark:text-[#CBD5CB] border border-[#E5E0D5] dark:border-[#2C382E]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls: Join / Chat / Call */}
                <div className="pt-4 border-t border-[#E5E0D5] dark:border-[#2C382E] flex flex-wrap items-center justify-between gap-2">
                  
                  {/* In-App Encrypted Chat & Call with Host */}
                  {!isAuthor && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          onOpenChat({
                            id: plan.authorId,
                            name: plan.authorName,
                            avatar: plan.authorAvatar,
                            handle: plan.authorHandle,
                            homeCity: plan.authorHomeCity,
                            trustScore: plan.authorTrustScore,
                            destination: plan.destinationName,
                            planTitle: plan.title,
                          })
                        }
                        className="px-3 py-2 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#2C362B] dark:text-[#EAEFE9] border border-[#E5E0D5] dark:border-[#2C382E] text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                        title="Chat in-app (Encrypted & zero phone # shared)"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084]" />
                        <span>Chat</span>
                      </button>

                      <button
                        onClick={() =>
                          onOpenCall(
                            {
                              id: plan.authorId,
                              name: plan.authorName,
                              avatar: plan.authorAvatar,
                              handle: plan.authorHandle,
                              homeCity: plan.authorHomeCity,
                              trustScore: plan.authorTrustScore,
                              destination: plan.destinationName,
                              planTitle: plan.title,
                            },
                            'audio'
                          )
                        }
                        className="p-2 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E] transition cursor-pointer shadow-xs"
                        title="Direct Voice Call (Encrypted)"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          onOpenCall(
                            {
                              id: plan.authorId,
                              name: plan.authorName,
                              avatar: plan.authorAvatar,
                              handle: plan.authorHandle,
                              homeCity: plan.authorHomeCity,
                              trustScore: plan.authorTrustScore,
                              destination: plan.destinationName,
                              planTitle: plan.title,
                            },
                            'video'
                          )
                        }
                        className="p-2 rounded-full bg-[#FAF8F5] dark:bg-[#202B22] hover:bg-[#F0F4EF] dark:hover:bg-[#28382A] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E] transition cursor-pointer shadow-xs"
                        title="Direct Video Call (Encrypted)"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Join / Leave Button */}
                  <button
                    onClick={() => handleJoinPlan(plan.id)}
                    disabled={isAuthor}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      isAuthor
                        ? 'bg-[#FAF8F5] dark:bg-[#202B22] text-[#8A8A8A] cursor-default border border-[#E5E0D5] dark:border-[#2C382E]'
                        : isJoined
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-[#5A6D56] hover:bg-[#2C362B] text-white'
                    }`}
                  >
                    {isAuthor ? (
                      <span>Your Plan</span>
                    ) : isJoined ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Joined (Leave)</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>Join Plan</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* POST NEW FREE DAY PLAN MODAL                                             */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] text-[#2C362B] dark:text-[#EAEFE9] rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E0D5] dark:border-[#2C382E] bg-[#FAF8F5] dark:bg-[#202B22] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#5A6D56] text-white flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#2C362B] dark:text-[#EAEFE9]">
                    Post a Free Day / Upcoming Plan
                  </h2>
                  <p className="text-xs text-[#8A8A8A] dark:text-[#9DAFA0]">
                    Invite fellow verified solo women in Himachal to join you
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white dark:bg-[#1B241D] border border-[#E5E0D5] dark:border-[#2C382E] flex items-center justify-center text-[#8A8A8A] hover:text-[#2C362B] dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreatePlanSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
              
              {/* Destination & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Destination Region</label>
                  <select
                    value={newDestinationId}
                    onChange={(e) => setNewDestinationId(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Activity Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PlanCategory)}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Plan Title */}
              <div>
                <label className="font-bold block mb-1">Plan Title</label>
                <input
                  type="text"
                  placeholder="e.g., Free morning in Old Manali: Cozy Cafe Coworking & Sunset Walk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                  required
                />
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Date</label>
                  <input
                    type="text"
                    placeholder="e.g., Tomorrow, Aug 25"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Time Slot / Hours</label>
                  <input
                    type="text"
                    placeholder="e.g., 10:00 AM - 04:00 PM"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                    required
                  />
                </div>
              </div>

              {/* Meeting Point */}
              <div>
                <label className="font-bold block mb-1">Public Meeting Point / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g., Drifter's Cafe deck or Mall Road Police Outpost"
                  value={newMeetingPoint}
                  onChange={(e) => setNewMeetingPoint(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                  required
                />
              </div>

              {/* Plan Description */}
              <div>
                <label className="font-bold block mb-1">Activity Plan Details & Vibe</label>
                <textarea
                  placeholder="Describe what you plan to do, what kind of travel buddy you are looking for, and what to expect..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl h-24 text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                  required
                />
              </div>

              {/* Max Buddies & Expense Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Max Women Buddies</label>
                  <select
                    value={newMaxBuddies}
                    onChange={(e) => setNewMaxBuddies(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs font-bold text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                  >
                    <option value={1}>1 Solo Buddy (1-on-1)</option>
                    <option value={2}>2 Solo Buddies</option>
                    <option value={3}>3 Solo Buddies</option>
                    <option value={4}>4 Small Group</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Expense Split Structure</label>
                  <input
                    type="text"
                    placeholder="e.g., Pay own bill + split taxi fare ₹150"
                    value={newEstimatedCost}
                    onChange={(e) => setNewEstimatedCost(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                  />
                </div>
              </div>

              {/* Safety Instructions & Tags */}
              <div>
                <label className="font-bold block mb-1">Safety Guidelines & Preferences</label>
                <input
                  type="text"
                  placeholder="e.g., Return before sunset, non-smoker, ID verified only"
                  value={newSafetyNotes}
                  onChange={(e) => setNewSafetyNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Co-working, Jogini Falls, Sunset Chai, Non-smoker"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#202B22] border border-[#E5E0D5] dark:border-[#2C382E] rounded-xl text-xs text-[#2C362B] dark:text-[#EAEFE9] focus:outline-none focus:border-[#5A6D56]"
                />
              </div>

              {/* Safety Shield Footer Notice */}
              <div className="p-3 rounded-2xl bg-[#F0F4EF] dark:bg-[#253327] border border-[#5A6D56]/20 dark:border-[#2C382E] text-[11px] text-[#5A6D56] dark:text-[#88B084] flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  Your personal phone number and private location will never be shared. Women connect directly through in-app encrypted chat and calls.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5E0D5] dark:border-[#2C382E] hover:bg-[#FAF8F5] dark:hover:bg-[#202B22] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] dark:hover:bg-[#475744] text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Publish Free Day Plan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
