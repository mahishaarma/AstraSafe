import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  BarChart3,
  X,
  Info,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Radio,
  HeartPulse,
  Car,
  Scale
} from 'lucide-react';
import { DestinationDossier } from '../types';

interface SafetyScoreMethodologyModalProps {
  destination: DestinationDossier;
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyScoreMethodologyModal: React.FC<SafetyScoreMethodologyModalProps> = ({
  destination,
  isOpen,
  onClose,
}) => {
  const [activePillarIdx, setActivePillarIdx] = useState<number>(0);

  if (!isOpen) return null;

  const methodology = destination.scoreMethodology;
  const activePillar = methodology.pillars[activePillarIdx] || methodology.pillars[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5E0D5] text-[#2C362B] rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5E0D5] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A6D56] text-white flex items-center justify-center shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-[#2C362B]">
                  Safety Score Audit & Methodology
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30">
                  Empirical Model
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Exact mathematical basis and field data sources for {destination.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E0D5]/50 border border-[#E5E0D5] flex items-center justify-center text-[#8A8A8A] hover:text-[#2C362B] transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Overall Score Banner */}
          <div className="p-5 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A6D56]">Composite Safety Index</span>
                <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#2C362B] border border-[#E5E0D5]">
                  Audited {methodology.lastAuditedDate}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#5A6D56] font-serif">
                  {destination.safetyIndex}
                </span>
                <span className="text-sm text-[#8A8A8A]">/ 10.0 Overall Safety Rating</span>
              </div>
              <p className="text-xs text-[#3D3D3D] mt-1">
                Auditing Authority: <strong>{methodology.auditAgency}</strong>
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E5E0D5] text-[11px] text-[#2C362B] max-w-xs space-y-1">
              <div className="font-bold flex items-center gap-1 text-[#5A6D56]">
                <ShieldCheck className="w-3.5 h-3.5" /> 7 Weighted Safety Pillars
              </div>
              <p className="text-[#8A8A8A] leading-relaxed">
                Aggregated from verified women traveler check-ins, telemetry lux checks, and police 1091 emergency dispatch records.
              </p>
            </div>
          </div>

          {/* Explanation Section: How we calculate this */}
          <div className="space-y-3">
            <h3 className="text-sm font-serif font-bold text-[#2C362B] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#5A6D56]" />
              On What Basis Did We Calculate These Scores?
            </h3>
            <p className="text-xs text-[#3D3D3D] leading-relaxed">
              {methodology.dataCollectionProcess}
            </p>
          </div>

          {/* Pillar Interactive Breakdown Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
                Select a Pillar to Inspect Empirical Metrics & Weight
              </span>
              <span className="text-xs text-[#5A6D56] font-bold">100% Weight Total</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {methodology.pillars.map((pillar, idx) => {
                const isSelected = idx === activePillarIdx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActivePillarIdx(idx)}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#5A6D56] text-white border-[#5A6D56] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#2C362B] border-[#E5E0D5] hover:border-[#5A6D56]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-[#2C362B]'}`}>
                        {pillar.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E0D5] text-[#2C362B]'
                        }`}
                      >
                        {pillar.weightPercentage}% Weight
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-full ${isSelected ? 'bg-amber-300' : 'bg-[#5A6D56]'}`}
                            style={{ width: `${(pillar.score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{pillar.score}/10</span>
                      </div>
                      <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-[#8A8A8A]'}`}>
                        Click to view audit
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Pillar Audit Inspector Card */}
          {activePillar && (
            <div className="p-5 rounded-2xl bg-white border-2 border-[#5A6D56]/40 space-y-3 shadow-sm animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#5A6D56] tracking-wider">
                    Pillar Audit Deep-Dive ({activePillar.weightPercentage}% of Overall Index)
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#2C362B]">
                    {activePillar.name} — <span className="text-[#5A6D56]">{activePillar.score} / 10</span>
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F0F4EF] text-[#5A6D56] font-bold text-xs border border-[#5A6D56]/30">
                  Data Source: {activePillar.dataSource}
                </span>
              </div>

              <p className="text-xs text-[#3D3D3D] leading-relaxed">
                {activePillar.description}
              </p>

              <div className="pt-2 border-t border-[#E5E0D5] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C362B] block">
                  Ground Truth Verification Metrics:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activePillar.keyMetrics.map((metric, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-[11px] text-[#2C362B] flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6D56] shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transparency Guarantee & Weekly Refresh Policy */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#5A6D56] shrink-0 mt-0.5" />
            <div className="text-xs text-[#3D3D3D] space-y-1">
              <p className="font-bold text-[#2C362B]">
                Independent & Non-Commercial Safety Policy
              </p>
              <p className="leading-relaxed">
                {methodology.disclaimer} We do not accept paid sponsorships from hotels, taxi unions, or commercial vendors to inflate safety scores. All ratings are algorithmic, field-tested, and women-explorer verified.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Close Methodology
          </button>
        </div>

      </div>
    </div>
  );
};
