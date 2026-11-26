import React, { useState } from 'react';
import {
  Map,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Compass,
  HardDrive,
  Shield,
  WifiOff,
  Wifi,
  Navigation,
  HeartPulse,
  Fuel,
  Home,
  RefreshCw,
  Eye,
  MapPin
} from 'lucide-react';
import { DestinationDossier, OfflineMapRegion } from '../types';

interface OfflineMapModalProps {
  destinations: DestinationDossier[];
  activeDestinationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineMapModal: React.FC<OfflineMapModalProps> = ({
  destinations,
  activeDestinationId,
  isOpen,
  onClose,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(activeDestinationId);
  const [downloadingMapId, setDownloadingMapId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [selectedWaypointIdx, setSelectedWaypointIdx] = useState<number | null>(0);
  const [downloadedState, setDownloadedState] = useState<Record<string, boolean>>({
    dest_manali: true,
    dest_dharamshala: true,
    dest_spiti: false,
    dest_kasol: false,
  });

  if (!isOpen) return null;

  const currentDest = destinations.find((d) => d.id === selectedDestId) || destinations[0];
  const offlineMap = currentDest.offlineMap;
  const isCurrentlyDownloaded = downloadedState[currentDest.id] ?? false;

  const handleDownloadMap = (destId: string) => {
    setDownloadingMapId(destId);
    setDownloadProgress(10);
    
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingMapId(null);
          setDownloadedState((old) => ({ ...old, [destId]: true }));
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const selectedWaypoint = selectedWaypointIdx !== null ? offlineMap.waypoints[selectedWaypointIdx] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E5E0D5] text-[#2C362B] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5E0D5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A6D56] text-white flex items-center justify-center shadow-sm">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-[#2C362B]">
                  Himalayan Offline Maps & Trail Grids
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0F4EF] text-[#5A6D56] border border-[#5A6D56]/30">
                  Zero Network Ready
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Download high-precision GPS maps with safe havens, dead zones, fuel stations, and emergency shelters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline Simulation Toggle */}
            <button
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                isOfflineSimulated
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-[#2C362B] border-[#E5E0D5] hover:bg-[#FAF8F5]'
              }`}
              title="Test viewing map in offline mode"
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Simulating 0G Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#5A6D56]" />
                  <span>Simulate 0G Mode</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E0D5]/50 border border-[#E5E0D5] flex items-center justify-center text-[#8A8A8A] hover:text-[#2C362B] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Region Switcher Pills */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#E5E0D5] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A] shrink-0">
            Region Pack:
          </span>
          {destinations.map((d) => {
            const isSelected = d.id === selectedDestId;
            const isDl = downloadedState[d.id];
            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDestId(d.id);
                  setSelectedWaypointIdx(0);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#5A6D56] text-white shadow-sm'
                    : 'bg-white text-[#2C362B] border border-[#E5E0D5] hover:border-[#5A6D56]/40'
                }`}
              >
                <span>{d.name.split('&')[0]}</span>
                {isDl ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-200' : 'text-[#5A6D56]'}`} />
                ) : (
                  <Download className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#8A8A8A]'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Map Status Bar & Download Control */}
          <div className="p-4 rounded-2xl bg-[#F0F4EF] border border-[#5A6D56]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#2C362B]">
                  {offlineMap.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#5A6D56] border border-[#5A6D56]/30">
                  {offlineMap.sizeMB} MB
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Last updated {offlineMap.lastUpdated} • High-precision vector trails + Emergency shelters database
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isCurrentlyDownloaded ? (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#5A6D56]/30 text-xs font-bold text-[#5A6D56] shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#5A6D56]" />
                  <span>Downloaded & Cached</span>
                </div>
              ) : (
                <button
                  onClick={() => handleDownloadMap(currentDest.id)}
                  disabled={downloadingMapId === currentDest.id}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {downloadingMapId === currentDest.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Downloading {downloadProgress}%...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Offline Map ({offlineMap.sizeMB} MB)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Map Overview Counts Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
              <span className="text-[10px] font-bold uppercase text-[#8A8A8A] block">Safe Shelters</span>
              <span className="text-lg font-black text-[#5A6D56]">{offlineMap.emergencySheltersCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
              <span className="text-[10px] font-bold uppercase text-[#8A8A8A] block">Medical & Oxygen</span>
              <span className="text-lg font-black text-emerald-700">{offlineMap.medicalPointsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
              <span className="text-[10px] font-bold uppercase text-[#8A8A8A] block">Police Checkposts</span>
              <span className="text-lg font-black text-[#B91C1C]">{offlineMap.policePostsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
              <span className="text-[10px] font-bold uppercase text-[#8A8A8A] block">Clean Water / Tea</span>
              <span className="text-lg font-black text-blue-700">{offlineMap.waterPointsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-center">
              <span className="text-[10px] font-bold uppercase text-[#8A8A8A] block">Cell Dead Zones</span>
              <span className="text-lg font-black text-amber-700">{offlineMap.deadZonesCount} Mapped</span>
            </div>
          </div>

          {/* Interactive Visual Offline Map Viewer Canvas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C362B] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#5A6D56]" />
                Interactive Offline Topo Viewer ({currentDest.name})
              </span>
              <span className="text-[11px] text-[#8A8A8A]">
                Click any waypoint marker to inspect offline survival notes
              </span>
            </div>

            {/* Map Visual Stage */}
            <div className="relative w-full h-80 rounded-2xl bg-[#1C261B] border border-[#5A6D56]/40 overflow-hidden shadow-inner flex items-center justify-center">
              
              {/* Mountain Topo Contours Background (SVG) */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="topo" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 0 20 Q 30 5 60 20 T 120 20" fill="none" stroke="#8DA388" strokeWidth="0.75" />
                    <path d="M 0 40 Q 30 25 60 40 T 120 40" fill="none" stroke="#8DA388" strokeWidth="0.75" />
                    <path d="M 0 60 Q 30 45 60 60 T 120 60" fill="none" stroke="#8DA388" strokeWidth="0.75" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#topo)" />
                <path d="M 50 250 Q 200 120 450 180 T 800 100" fill="none" stroke="#5A6D56" strokeWidth="3" strokeDasharray="6,4" />
              </svg>

              {/* Offline GPS Compass Overlay */}
              <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>GPS 32°14&apos;N 77°11&apos;E</span>
                </div>
                <div className="text-white/70 text-[10px]">
                  Mode: {isOfflineSimulated ? 'Cached Offline Vector' : 'Active Satellite Link'}
                </div>
              </div>

              {/* Waypoint Interactive Nodes */}
              <div className="absolute inset-8 flex flex-wrap items-center justify-around gap-4 pointer-events-auto">
                {offlineMap.waypoints.map((wp, idx) => {
                  const isSelected = selectedWaypointIdx === idx;
                  let bgCol = 'bg-[#5A6D56] text-white';
                  let icon = <MapPin className="w-4 h-4" />;

                  if (wp.type === 'police') {
                    bgCol = 'bg-rose-700 text-white';
                    icon = <Shield className="w-4 h-4" />;
                  } else if (wp.type === 'medical') {
                    bgCol = 'bg-emerald-600 text-white';
                    icon = <HeartPulse className="w-4 h-4" />;
                  } else if (wp.type === 'fuel') {
                    bgCol = 'bg-amber-600 text-white';
                    icon = <Fuel className="w-4 h-4" />;
                  } else if (wp.type === 'dead_zone') {
                    bgCol = 'bg-orange-700 text-white';
                    icon = <WifiOff className="w-4 h-4" />;
                  } else if (wp.type === 'shelter') {
                    bgCol = 'bg-indigo-600 text-white';
                    icon = <Home className="w-4 h-4" />;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedWaypointIdx(idx)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer ${
                        isSelected ? 'scale-110 ring-4 ring-white/50 bg-black/40' : 'hover:scale-105'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full ${bgCol} flex items-center justify-center shadow-lg`}>
                        {icon}
                      </div>
                      <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {wp.name.split(' ')[0]} ({wp.elevation})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status Badge Bottom */}
              <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                ● 100% Vector Trails Offline Accessible
              </div>
            </div>
          </div>

          {/* Selected Waypoint Detail Card */}
          {selectedWaypoint && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#5A6D56] text-white">
                    {selectedWaypoint.type.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-sm text-[#2C362B]">{selectedWaypoint.name}</h4>
                </div>
                <div className="text-xs font-mono text-[#5A6D56] font-bold">
                  Elevation: {selectedWaypoint.elevation} • Lat {selectedWaypoint.lat}, Lng {selectedWaypoint.lng}
                </div>
              </div>
              <p className="text-xs text-[#3D3D3D]">
                <strong className="text-[#2C362B]">Field Guidance: </strong>
                {selectedWaypoint.notes}
              </p>
            </div>
          )}

          {/* Pre-Trip Safety Tip for Zero Network */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold">Offline Himalayan Safety Protocol</p>
              <p className="leading-relaxed">
                Before embarking toward high passes (like Rohtang, Kunzum, or Triund), always download the corresponding offline map pack. In cellular dead zones, AstraSafe continues tracking your distance to the nearest verified safe haven and emergency first-aid station using device GPS without internet.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E0D5] bg-[#FAF8F5] flex justify-between items-center">
          <span className="text-xs text-[#8A8A8A]">
            Total Downloaded: {destinations.filter((d) => downloadedState[d.id]).length} of {destinations.length} Regional Maps
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] text-white text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
