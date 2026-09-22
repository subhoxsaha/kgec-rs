import React, { useState, useEffect } from 'react';
import { LogoType, getLogoCandidateUrls } from '../utils/logoUtils';

interface ThemedLogoProps {
  type: LogoType;
  isDark: boolean;
  alt: string;
  className?: string;
}

export const ThemedLogo: React.FC<ThemedLogoProps> = ({
  type,
  isDark,
  alt,
  className = 'w-full h-full object-contain',
}) => {
  const candidateUrls = getLogoCandidateUrls(type, isDark);
  const [candidateIndex, setCandidateIndex] = useState(0);

  // Reset to first candidate when type or theme changes
  useEffect(() => {
    setCandidateIndex(0);
  }, [type, isDark]);

  const handleError = () => {
    if (candidateIndex < candidateUrls.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    }
  };

  const currentSrc = candidateUrls[candidateIndex] || candidateUrls[0];

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="eager"
    />
  );
};
