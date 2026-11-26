import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  MapPin,
  ThumbsUp,
  Plus,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Pin,
  Flame,
  Eye,
  Camera,
  Filter,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CommunityPost, UserProfile } from '../types';
import { INITIAL_COMMUNITY_POSTS } from '../data/mockData';

interface CommunityFeedProps {
  user: UserProfile;
  currentLocationName: string;
}

// Preset photo selections for rapid presentation & pitch demo
const DEMO_PHOTO_PRESETS = [
  {
    name: 'Dharamshala & Triund Ridge',
    url: 'https://images.unsplash.com/photo-1597074866923-dc05886a035f?auto=format&fit=crop&w=1200&q=80',
    location: 'Triund Ridge, Dharamshala',
    destinationId: 'dest_dharamshala',
    caption: 'Majestic Dhauladhar snowy range above Triund meadow'
  },
  {
    name: 'Spiti Valley & Key Monastery',
    url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    location: 'Key Monastery, Kaza, Spiti',
    destinationId: 'dest_spiti',
    caption: '1000-year-old Key Gompa perched high in trans-Himalayas'
  },
  {
    name: 'Manali & Solang Snow Valley',
    url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    location: 'Solang Valley, Manali',
    destinationId: 'dest_manali',
    caption: 'Pristine alpine meadow and pine slopes near Solang'
  },
  {
    name: 'Kasol & Parvati River Woods',
    url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    location: 'Parvati River, Kasol',
    destinationId: 'dest_kasol',
    caption: 'Crystal river rapids winding through dense cedar forest'
  },
  {
    name: 'Chandratal Moon Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    location: 'Chandratal Lake (4,250m)',
    destinationId: 'dest_spiti',
    caption: 'High-altitude turquoise glacial lake in Spiti Valley'
  }
];

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ user, currentLocationName }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageForZoom, setSelectedImageForZoom] = useState<{ url: string; caption?: string; title: string } | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDestFilter, setSelectedDestFilter] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CommunityPost['category']>('safety_tip');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [isPinnedCritical, setIsPinnedCritical] = useState(false);
  const [locationInput, setLocationInput] = useState(currentLocationName);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        if (!photoCaption) {
          setPhotoCaption(file.name.replace(/\.[^/.]+$/, ""));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const upvoted = !p.userUpvoted;
          return {
            ...p,
            userUpvoted: upvoted,
            upvotes: upvoted ? p.upvotes + 1 : p.upvotes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      authorHomeCity: user.homeCity,
      destinationId: 'dest_manali', // default or dynamic
      location: locationInput || currentLocationName,
      timeAgo: 'Just now',
      category,
      title,
      content,
      photoUrl: photoUrl.trim() || undefined,
      photoCaption: photoCaption.trim() || undefined,
      isPinnedCritical,
      criticalAlertBadge: isPinnedCritical ? '⚡ LIVE FIELD SAFETY REPORT (PINNED)' : undefined,
      upvotes: 1,
      userUpvoted: true,
      verifiedIDBadge: true,
    };

    // If pinned critical, add to top; otherwise after pinned posts
    if (isPinnedCritical) {
      setPosts([newPost, ...posts]);
    } else {
      const pinned = posts.filter((p) => p.isPinnedCritical);
      const regular = posts.filter((p) => !p.isPinnedCritical);
      setPosts([...pinned, newPost, ...regular]);
    }

    // Reset Form
    setTitle('');
    setContent('');
    setPhotoUrl('');
    setPhotoCaption('');
    setIsPinnedCritical(false);
    setShowModal(false);
  };

  // Filtered Posts Logic
  const filteredPosts = posts.filter((post) => {
    if (selectedDestFilter !== 'all' && post.destinationId !== selectedDestFilter) {
      return false;
    }
    if (selectedCategory === 'pinned' && !post.isPinnedCritical) {
      return false;
    }
    if (selectedCategory === 'photos' && !post.photoUrl) {
      return false;
    }
    if (
      selectedCategory !== 'all' &&
      selectedCategory !== 'pinned' &&
      selectedCategory !== 'photos' &&
      post.category !== selectedCategory
    ) {
      return false;
    }
    return true;
  });

  // Separate pinned critical posts vs regular feed
  const pinnedPosts = filteredPosts.filter((p) => p.isPinnedCritical);
  const regularPosts = filteredPosts.filter((p) => !p.isPinnedCritical);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E5E0D5] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-600" /> Ground-Truth Intelligence
            </span>
            <span className="text-xs text-[#8A8A8A]">Live Community Stream</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C362B] mt-1 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#5A6D56]" /> Live Safety & Ground Photo Feed
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Real-time field updates, trail photos, road cautions, and safety experiences verified by solo female travelers across Himachal
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs transition shadow-sm cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Photo / Post Update</span>
        </button>
      </div>

      {/* Destination & Category Filter Navigation */}
      <div className="bg-white border border-[#E5E0D5] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Region Filter Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-[#8A8A8A] uppercase">Region:</span>
          <select
            value={selectedDestFilter}
            onChange={(e) => setSelectedDestFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-3 py-1.5 font-bold text-[#2C362B] text-xs focus:outline-none cursor-pointer"
          >
            <option value="all">🏔️ All Himachal Regions</option>
            <option value="dest_manali">Manali & Solang Valley</option>
            <option value="dest_spiti">Spiti Valley (Kaza & Tabo)</option>
            <option value="dest_dharamshala">Dharamshala & McLeod Ganj</option>
            <option value="dest_kasol">Kasol & Parvati Valley</option>
          </select>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
            }`}
          >
            All Updates ({filteredPosts.length})
          </button>
          <button
            onClick={() => setSelectedCategory('pinned')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'pinned'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <Pin className="w-3 h-3" /> Pinned Critical
          </button>
          <button
            onClick={() => setSelectedCategory('photos')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'photos'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
            }`}
          >
            <Camera className="w-3 h-3" /> Photo Logs
          </button>
          <button
            onClick={() => setSelectedCategory('hazard_warning')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              selectedCategory === 'hazard_warning'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
            }`}
          >
            ⚠️ Hazard Alerts
          </button>
          <button
            onClick={() => setSelectedCategory('safety_tip')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              selectedCategory === 'safety_tip'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
            }`}
          >
            💡 Safety Tips
          </button>
          <button
            onClick={() => setSelectedCategory('transport_update')}
            className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
              selectedCategory === 'transport_update'
                ? 'bg-[#5A6D56] text-white shadow-xs'
                : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
            }`}
          >
            🚕 Transport
          </button>
        </div>
      </div>

      {/* SECTION 1: ESSENTIAL PINNED POSTS (ALWAYS AT THE TOP) */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-1.5">
              <Pin className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span>Essential Ground Advisories & Critical Updates (Pinned at Top)</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              High Priority Ground Telemetry
            </span>
          </div>

          <div className="space-y-4">
            {pinnedPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 border-2 border-rose-300 shadow-md space-y-4 relative overflow-hidden"
              >
                {/* Ribbon Tag */}
                <div className="flex items-center justify-between gap-2 border-b border-rose-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {post.criticalAlertBadge || 'CRITICAL GROUND DIRECTIVE'}
                    </span>
                    <span className="text-xs text-[#8A8A8A] font-semibold">{post.timeAgo}</span>
                  </div>

                  <span className="text-xs font-bold text-[#5A6D56] flex items-center gap-1 bg-[#F0F4EF] px-2.5 py-0.5 rounded-full border border-[#5A6D56]/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Source
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-rose-600 shadow-xs"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-1.5">
                        {post.authorName}
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                      </h4>
                      <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
                        <span>{post.authorHandle}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3 text-[#5A6D56]" />
                        <span className="text-[#2C362B] font-bold">{post.location}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C362B] leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2C362B] leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Post Image with Lightbox preview */}
                {post.photoUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-rose-200 group cursor-pointer"
                    onClick={() => setSelectedImageForZoom({ url: post.photoUrl!, caption: post.photoCaption, title: post.title })}
                  >
                    <img
                      src={post.photoUrl}
                      alt={post.title}
                      className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-4 text-white">
                      <p className="text-xs font-semibold drop-shadow-md">{post.photoCaption || 'Click to view high-res photo'}</p>
                      <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-xs text-[10px] font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View Photo
                      </span>
                    </div>
                  </div>
                )}

                {/* Upvotes & Engagement */}
                <div className="pt-3 border-t border-rose-200/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition cursor-pointer ${
                      post.userUpvoted
                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                        : 'bg-white border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Urgent & Helpful ({post.upvotes})
                  </button>

                  <span className="text-[11px] text-rose-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> HP Police & Tourism Ground Verified
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: REGULAR COMMUNITY & PHOTO STREAM */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#5A6D56]" />
            <span>Community Traveler Logs & Real Photos</span>
          </h3>
          <span className="text-xs text-[#8A8A8A]">
            Showing {regularPosts.length} updates
          </span>
        </div>

        <div className="space-y-4">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D5] hover:border-[#5A6D56]/50 transition space-y-3.5 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-[#5A6D56]"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-1.5">
                      {post.authorName}
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5A6D56]" />
                    </h4>
                    <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1">
                      <span>{post.authorHandle}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-[#5A6D56]" />
                      <span className="text-[#5A6D56] font-bold">{post.location}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-[#8A8A8A]">{post.timeAgo}</span>
              </div>

              {/* Tag & Text */}
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase mb-1.5 ${
                    post.category === 'hazard_warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : post.category === 'photo_spot'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : post.category === 'female_stay'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : post.category === 'transport_update'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30'
                  }`}
                >
                  {post.category.replace('_', ' ')}
                </span>
                
                <h3 className="font-serif font-bold text-base text-[#2C362B]">{post.title}</h3>
                <p className="text-xs text-[#3D3D3D] mt-1 leading-relaxed">{post.content}</p>
              </div>

              {/* Photo Display if Present */}
              {post.photoUrl && (
                <div
                  className="relative rounded-2xl overflow-hidden border border-[#E5E0D5] group cursor-pointer shadow-xs"
                  onClick={() => setSelectedImageForZoom({ url: post.photoUrl!, caption: post.photoCaption, title: post.title })}
                >
                  <img
                    src={post.photoUrl}
                    alt={post.title}
                    className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3.5 text-white">
                    <p className="text-xs font-semibold drop-shadow-sm">{post.photoCaption || 'Real Photo Log'}</p>
                    <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Click to Expand
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition cursor-pointer ${
                    post.userUpvoted
                      ? 'bg-[#F0F4EF] text-[#5A6D56] border-[#5A6D56]/40 font-bold'
                      : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#8A8A8A] hover:text-[#2C362B]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({post.upvotes})
                </button>

                <span className="text-[10px] text-[#5A6D56] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ID Verified Post
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO LIGHTBOX / EXPAND MODAL */}
      {selectedImageForZoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
              <div>
                <h3 className="font-serif font-bold text-base">{selectedImageForZoom.title}</h3>
                {selectedImageForZoom.caption && (
                  <p className="text-xs text-slate-400 mt-0.5">{selectedImageForZoom.caption}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedImageForZoom(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={selectedImageForZoom.url}
                alt={selectedImageForZoom.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-3.5 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <span>Verified High-Resolution Himachal Travel Photograph</span>
              <button
                onClick={() => setSelectedImageForZoom(null)}
                className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SHARE / PHOTO UPLOAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E0D5] rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col text-[#2C362B] shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E0D5] bg-[#FAF8F5] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2C362B] flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#5A6D56]" /> Share Field Update & Real Photos
                </h3>
                <p className="text-xs text-[#8A8A8A]">Post verified ground conditions, safe haven tips, or photo logs</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#8A8A8A] hover:text-[#2C362B] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddPost} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {/* Category & Pin Critical Alert */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A8A8A] font-bold mb-1">Update Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-3 py-2 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
                  >
                    <option value="safety_tip">💡 Safety Tip & Good Experience</option>
                    <option value="hazard_warning">⚠️ Route Hazard / Unlit Caution</option>
                    <option value="photo_spot">📷 Real Photo Log & Scenic Route</option>
                    <option value="female_stay">🏡 Women-Managed Stay / Cafe Note</option>
                    <option value="transport_update">🚕 Prepaid Taxi / Bus Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8A8A8A] font-bold mb-1">Exact Mountain Location</label>
                  <input
                    type="text"
                    required
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. Old Manali Bridge, Solang, Triund Trail"
                    className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-3 py-2 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
                  />
                </div>
              </div>

              {/* Pinned Critical Advisory Toggle */}
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="pinCritical"
                  checked={isPinnedCritical}
                  onChange={(e) => setIsPinnedCritical(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-rose-600 rounded cursor-pointer accent-rose-600"
                />
                <label htmlFor="pinCritical" className="cursor-pointer">
                  <span className="font-bold text-rose-900 block">📌 Pin this as an Essential Critical Advisory</span>
                  <span className="text-[11px] text-rose-700">
                    High priority safety warnings (e.g. active landslide, severe weather, unlit night hazard) stay pinned at the top of the community feed.
                  </span>
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[#8A8A8A] font-bold mb-1">Update Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clear conditions on Triund trail & safe women homestay nearby"
                  className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-3 py-2 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[#8A8A8A] font-bold mb-1">Detailed Observation & Safety Tips</label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe lighting, cell reception, police presence, road terrain, or helpful tips for other solo women..."
                  className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-3 py-2 text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-2 pt-1 border-t border-[#E5E0D5]">
                <label className="block text-[#2C362B] font-bold">
                  Attach Ground Photo (Optional)
                </label>

                {/* Upload or Drop Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E5E0D5] hover:border-[#5A6D56] rounded-2xl p-4 text-center cursor-pointer bg-[#FAF8F5] hover:bg-[#F0F4EF] transition space-y-1.5"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-[#5A6D56] mx-auto" />
                  <p className="font-bold text-[#2C362B]">Click to browse & upload a photo from your device</p>
                  <p className="text-[11px] text-[#8A8A8A]">Supports JPG, PNG, WEBP (Instant preview)</p>
                </div>

                {/* Rapid Preset Selector for Demo Presentation */}
                <div className="p-3 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6D56] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Quick Demo Real-Life Photo Presets (1-Tap Selection):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEMO_PHOTO_PRESETS.map((preset, pIdx) => (
                      <button
                        type="button"
                        key={pIdx}
                        onClick={() => {
                          setPhotoUrl(preset.url);
                          setPhotoCaption(preset.caption);
                          setLocationInput(preset.location);
                          if (!title) setTitle(`Scenic update from ${preset.name}`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          photoUrl === preset.url
                            ? 'bg-[#5A6D56] text-white border-[#5A6D56]'
                            : 'bg-white text-[#2C362B] border-[#E5E0D5] hover:border-[#5A6D56]'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo URL manual input & Preview */}
                {photoUrl && (
                  <div className="space-y-2 p-3 rounded-2xl bg-white border border-[#5A6D56]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#5A6D56]">Attached Photo Preview:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl('');
                          setPhotoCaption('');
                        }}
                        className="text-rose-600 hover:text-rose-800 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" /> Remove Photo
                      </button>
                    </div>

                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-xl border border-[#E5E0D5]"
                    />

                    <div>
                      <label className="block text-[#8A8A8A] text-[10px] font-bold mb-0.5">Photo Caption / Note</label>
                      <input
                        type="text"
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                        placeholder="e.g. View of snow ridge from the trail"
                        className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-[#2C362B] text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold cursor-pointer shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Publish to Community Safety Stream</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
