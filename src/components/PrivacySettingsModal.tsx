import React, { useState } from 'react';
import { X, Lock, Eye, Shield, CheckCircle, Radio, EyeOff, UserCheck } from 'lucide-react';
import { PrivacySettings, UserProfile } from '../types';

interface PrivacySettingsModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePrivacy: (privacy: PrivacySettings) => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdatePrivacy,
}) => {
  const [privacy, setPrivacy] = useState<PrivacySettings>(user.privacy);
  const [previewRole, setPreviewRole] = useState<'verified_peer' | 'local_guide' | 'public'>('verified_peer');

  if (!isOpen) return null;

  const handleToggle = (key: keyof PrivacySettings) => {
    if (typeof privacy[key] === 'boolean') {
      const updated = { ...privacy, [key]: !privacy[key] };
      setPrivacy(updated);
      onUpdatePrivacy(updated);
    }
  };

  const handleSelect = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    onUpdatePrivacy(updated);
  };

  // Helper function to render profile card as previewed by selected audience
  const renderPreviewName = () => {
    if (previewRole === 'public') return 'A. R. (Verified Female Member)';
    if (privacy.nameDisplay === 'first_initial') return 'Ananya R.';
    if (privacy.nameDisplay === 'handle_only') return user.handle;
    return user.name;
  };

  const renderPreviewLocation = () => {
    if (previewRole === 'public') return 'Himachal Pradesh Region (Protected)';
    if (privacy.locationVisibility === 'hidden') return 'Location Hidden by User';
    if (privacy.locationVisibility === 'fuzzy_3km') return 'Within 3 km of Old Manali, HP';
    return 'Exact GPS: Log Huts, Old Manali';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C362B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5E0D5] rounded-3xl w-full max-w-3xl text-[#2C362B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E0D5] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/30 flex items-center justify-center text-[#5A6D56]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2C362B]">Granular Profile Privacy Controls</h2>
              <p className="text-xs text-[#8A8A8A]">Decide exactly what others see about you in the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8A8A8A] hover:text-[#2C362B] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Grid with Controls & Live Preview */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Privacy Controls */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Location Visibility */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">
                  1. Location Precision Radius
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelect('locationVisibility', 'fuzzy_3km')}
                    className={`p-2.5 rounded-full border text-xs font-bold transition text-center cursor-pointer ${
                      privacy.locationVisibility === 'fuzzy_3km'
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56]'
                        : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D]'
                    }`}
                  >
                    Fuzzy 3km
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('locationVisibility', 'exact')}
                    className={`p-2.5 rounded-full border text-xs font-bold transition text-center cursor-pointer ${
                      privacy.locationVisibility === 'exact'
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56]'
                        : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D]'
                    }`}
                  >
                    Exact GPS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('locationVisibility', 'hidden')}
                    className={`p-2.5 rounded-full border text-xs font-bold transition text-center cursor-pointer ${
                      privacy.locationVisibility === 'hidden'
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56]'
                        : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D]'
                    }`}
                  >
                    Hidden
                  </button>
                </div>
              </div>

              {/* Name Display Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">
                  2. Name & Identity Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelect('nameDisplay', 'first_initial')}
                    className={`p-2.5 rounded-full border text-xs font-bold transition text-center cursor-pointer ${
                      privacy.nameDisplay === 'first_initial'
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56]'
                        : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D]'
                    }`}
                  >
                    First + Initial
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('nameDisplay', 'full')}
                    className={`p-2.5 rounded-full border text-xs font-bold transition text-center cursor-pointer ${
                      privacy.nameDisplay === 'full'
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56]'
                        : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D]'
                    }`}
                  >
                    Full Name
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect('nameDisplay', 'handle_only')}
                    className={`p-2.5 rounded-full border text-xs font-bold transition text-center cursor-pointer ${
                      privacy.nameDisplay === 'handle_only'
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56]'
                        : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D]'
                    }`}
                  >
                    Handle Only
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div>
                    <span className="text-xs font-bold text-[#2C362B]">Show Travel Itinerary to Verified Peers</span>
                    <p className="text-[11px] text-[#8A8A8A]">Allows companion matching on mountain trips</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacy.showItinerary}
                    onChange={() => handleToggle('showItinerary')}
                    className="w-4 h-4 accent-[#5A6D56] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div>
                    <span className="text-xs font-bold text-[#2C362B]">Display Profession & Bio</span>
                    <p className="text-[11px] text-[#8A8A8A]">Helpful for networking with female digital nomads</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacy.showProfession}
                    onChange={() => handleToggle('showProfession')}
                    className="w-4 h-4 accent-[#5A6D56] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div>
                    <span className="text-xs font-bold text-[#2C362B]">Anonymous Safety Query Mode</span>
                    <p className="text-[11px] text-[#8A8A8A]">Post safety questions without attaching your handle</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacy.anonymousQueryMode}
                    onChange={() => handleToggle('anonymousQueryMode')}
                    className="w-4 h-4 accent-[#5A6D56] cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Live Card Previewer */}
            <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#2C362B] uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#5A6D56]" /> Live Profile Preview
                  </span>
                </div>

                {/* Audience Selector */}
                <div className="flex gap-1 p-1 bg-white rounded-full border border-[#E5E0D5] mb-4 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPreviewRole('verified_peer')}
                    className={`flex-1 py-1 rounded-full font-bold transition cursor-pointer ${
                      previewRole === 'verified_peer' ? 'bg-[#5A6D56] text-white' : 'text-[#8A8A8A]'
                    }`}
                  >
                    Verified Peer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewRole('local_guide')}
                    className={`flex-1 py-1 rounded-full font-bold transition cursor-pointer ${
                      previewRole === 'local_guide' ? 'bg-[#5A6D56] text-white' : 'text-[#8A8A8A]'
                    }`}
                  >
                    Local Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewRole('public')}
                    className={`flex-1 py-1 rounded-full font-bold transition cursor-pointer ${
                      previewRole === 'public' ? 'bg-[#5A6D56] text-white' : 'text-[#8A8A8A]'
                    }`}
                  >
                    Public
                  </button>
                </div>

                {/* Preview Card */}
                <div className="bg-white border border-[#E5E0D5] rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#5A6D56]"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#2C362B] flex items-center gap-1.5">
                        {renderPreviewName()}
                        <CheckCircle className="w-3.5 h-3.5 text-[#5A6D56] shrink-0" />
                      </h4>
                      <p className="text-[11px] text-[#8A8A8A]">{user.handle}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 pt-2 border-t border-[#E5E0D5]">
                    <div className="text-[#3D3D3D]">
                      <span className="text-[#8A8A8A] font-bold">Location: </span>
                      <span className="font-medium text-[#2C362B]">{renderPreviewLocation()}</span>
                    </div>

                    {privacy.showProfession && previewRole !== 'public' && (
                      <div className="text-[#3D3D3D]">
                        <span className="text-[#8A8A8A] font-bold">Profession: </span>
                        <span>{user.profession} • {user.homeCity}</span>
                      </div>
                    )}

                    {privacy.showItinerary && previewRole !== 'public' && (
                      <div className="text-[#3D3D3D]">
                        <span className="text-[#8A8A8A] font-bold">Current Trip: </span>
                        <span className="text-[#5A6D56] font-bold">{user.currentTrip?.destination}</span>
                      </div>
                    )}

                    {previewRole === 'public' && (
                      <div className="p-2 rounded-xl bg-[#F0F4EF] border border-[#5A6D56]/20 text-[10px] text-[#5A6D56] font-bold flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5" /> Direct contact & trip details hidden from unverified users.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-[10px] text-[#8A8A8A] text-center font-medium">
                AstraSafe Encryption Core • Settings save automatically
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs transition shadow-sm cursor-pointer"
          >
            Apply Privacy Profile
          </button>
        </div>

      </div>
    </div>
  );
};
