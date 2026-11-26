import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, Camera, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface IDVerificationModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const IDVerificationModal: React.FC<IDVerificationModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(user.verificationStatus === 'verified_explorer' ? 3 : 1);
  const [docType, setDocType] = useState<'passport' | 'national_id' | 'driver_license'>('national_id');
  const [docNumber, setDocNumber] = useState('8832 9102 4410');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateVerification = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      onUpdateUser({
        ...user,
        verificationStatus: 'verified_explorer',
        idType: docType,
        verifiedDate: new Date().toISOString().split('T')[0],
        trustScore: 99,
        badges: Array.from(new Set([...user.badges, 'Government ID Verified', 'Facial Liveness Passed'])),
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C362B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5E0D5] rounded-3xl w-full max-w-2xl text-[#2C362B] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E0D5] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/30 flex items-center justify-center text-[#5A6D56]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2C362B]">Community Identity Verification</h2>
              <p className="text-xs text-[#8A8A8A]">Zero Fake Profiles • Verified Women Explorers Only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8A8A8A] hover:text-[#2C362B] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Why We Verify Banner */}
          <div className="p-4 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/20 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#5A6D56] shrink-0 mt-0.5" />
            <div className="text-xs text-[#3D3D3D] leading-relaxed">
              <span className="font-bold text-[#5A6D56]">Why Identity Verification Matters:</span>
              <p className="mt-1">
                To guarantee absolute safety in our solo travel community, all members must undergo biometric facial liveness and Government ID matching. This eliminates bot accounts, fake profiles, and unauthorized solicitations. Your document details are encrypted and never disclosed to other users.
              </p>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-[#2C362B] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5A6D56]" /> Step 1: Select Government Identity Document
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDocType('national_id')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    docType === 'national_id'
                      ? 'bg-[#F0F4EF] border-[#5A6D56] text-[#2C362B]'
                      : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D] hover:bg-[#E5E0D5]/50'
                  }`}
                >
                  <p className="font-serif font-bold text-sm">National ID / Aadhaar</p>
                  <p className="text-xs text-[#8A8A8A] mt-1">Instant digital QR validation</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDocType('passport')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    docType === 'passport'
                      ? 'bg-[#F0F4EF] border-[#5A6D56] text-[#2C362B]'
                      : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D] hover:bg-[#E5E0D5]/50'
                  }`}
                >
                  <p className="font-serif font-bold text-sm">Passport</p>
                  <p className="text-xs text-[#8A8A8A] mt-1">International solo travelers</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDocType('driver_license')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    docType === 'driver_license'
                      ? 'bg-[#F0F4EF] border-[#5A6D56] text-[#2C362B]'
                      : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#3D3D3D] hover:bg-[#E5E0D5]/50'
                  }`}
                >
                  <p className="font-serif font-bold text-sm">Driver's License</p>
                  <p className="text-xs text-[#8A8A8A] mt-1">Government road permit</p>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A8A8A] mb-1">
                  Document Reference Number
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-4 py-2.5 text-sm text-[#2C362B] focus:outline-none focus:border-[#5A6D56]"
                  placeholder="Enter ID Number"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-full font-bold bg-[#5A6D56] hover:bg-[#2C362B] text-white transition shadow-sm cursor-pointer"
              >
                Proceed to Facial Liveness Check →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FAF8F5] border-2 border-dashed border-[#5A6D56] flex items-center justify-center text-[#5A6D56]">
                <Camera className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <h3 className="text-base font-serif font-bold text-[#2C362B]">Biometric Facial Liveness Verification</h3>
                <p className="text-xs text-[#8A8A8A] mt-1 max-w-md mx-auto">
                  A quick 3-second camera match ensures that your live face matches the uploaded government ID document.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#5A6D56] font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Camera feed active & encrypted
                </div>
                <div className="flex items-center gap-2 text-[#3D3D3D]">
                  <CheckCircle2 className="w-4 h-4 text-[#5A6D56]" /> Document OCR match completed
                </div>
                <div className="flex items-center gap-2 text-[#3D3D3D]">
                  <CheckCircle2 className="w-4 h-4 text-[#5A6D56]" /> Sex & Identity confirmed as female explorer
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-full border border-[#E5E0D5] text-[#2C362B] text-xs font-bold hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSimulateVerification}
                  disabled={isProcessing}
                  className="w-2/3 py-3 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Biometrics...</span>
                    </>
                  ) : (
                    <span>Complete Verification ✓</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F0F4EF] border border-[#5A6D56]/50 flex items-center justify-center text-[#5A6D56]">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#F0F4EF] text-[#5A6D56] text-xs font-bold border border-[#5A6D56]/30">
                  VERIFIED EXPLORER BADGE ACTIVE
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2C362B] mt-2">Identity Confirmed</h3>
                <p className="text-xs text-[#3D3D3D] mt-1">
                  You hold a 99% Community Trust Score. You now have full access to connect with vetted local female guides, message peer solo travelers, and post real-time safety advisories.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D5] text-xs">
                <div>
                  <span className="text-[#8A8A8A] font-bold">Verified ID Type:</span>
                  <p className="font-semibold text-[#2C362B] capitalize">{user.idType || 'National ID'}</p>
                </div>
                <div>
                  <span className="text-[#8A8A8A] font-bold">Verification Date:</span>
                  <p className="font-semibold text-[#2C362B]">{user.verifiedDate || '2026-08-10'}</p>
                </div>
                <div>
                  <span className="text-[#8A8A8A] font-bold">Trust Score:</span>
                  <p className="font-semibold text-[#5A6D56]">{user.trustScore}% Verified</p>
                </div>
                <div>
                  <span className="text-[#8A8A8A] font-bold">Sybil Protection:</span>
                  <p className="font-semibold text-[#5A6D56]">Passed Liveness</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-full bg-[#FAF8F5] hover:bg-[#E5E0D5] border border-[#E5E0D5] text-[#2C362B] font-bold transition cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
