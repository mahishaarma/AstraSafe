import React from 'react';
import logoImg from '../assets/images/astrasafe_logo_1787574001308.jpg';

interface AstraSafeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'splash' | 'full';
  showTagline?: boolean;
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AstraSafeLogo: React.FC<AstraSafeLogoProps> = ({
  size = 'md',
  showTagline = false,
  showWordmark = false,
  className = '',
  onClick,
}) => {
  // Dimension presets for the clean original logo image
  const getImageDimensions = () => {
    switch (size) {
      case 'xs':
        return 'w-7 h-7';
      case 'sm':
        return 'w-9 h-9';
      case 'md':
        return 'w-11 h-11';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      case 'splash':
        return 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 max-w-full';
      case 'full':
        return 'w-full max-w-xs sm:max-w-sm';
      default:
        return 'w-11 h-11';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Clean original logo image without unwanted cropping or alteration */}
      <div className={`relative ${getImageDimensions()} rounded-2xl overflow-hidden shrink-0 flex items-center justify-center`}>
        <img
          src={logoImg}
          alt="AstraSafe — Safe Journeys. Stronger Women."
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {/* Optional supplementary wordmark if requested */}
      {(showWordmark || showTagline) && (
        <div className="flex flex-col">
          {showWordmark && (
            <span className="font-serif font-black text-lg tracking-tight text-[#2C362B] dark:text-[#FFFFFF] leading-none">
              Astra<span className="text-[#5A6D56] dark:text-[#88B084]">Safe</span>
            </span>
          )}

          {showTagline && (
            <span className="font-sans font-bold uppercase text-[10px] tracking-widest text-[#5A6D56] dark:text-[#9DAFA0] mt-1">
              Safe Journeys. Stronger Women.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
