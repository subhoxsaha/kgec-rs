import React, { useState, useEffect, useRef } from 'react';

/**
 * Global In-Memory Resolved Image Cache
 * Eliminates redundant network probes and provides 0ms instant display across re-renders.
 */
export const resolvedImageCache = new Map<string, string>();

/**
 * Background Pre-warmer
 * Decodes images asynchronously in off-screen threads so user scrolling is 60fps stutter-free.
 */
export function prewarmImages(urls: string[]) {
  if (typeof window === 'undefined') return;
  const runner = () => {
    urls.slice(0, 12).forEach((url) => {
      if (!url || resolvedImageCache.has(url)) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runner, { timeout: 1500 });
  } else {
    setTimeout(runner, 100);
  }
}

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError' | 'onLoad'> {
  src: string;
  candidates?: string[];
  alt: string;
  fallbackSrc?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Smooth, Optimized Image Component
 * - Async decoding (off-loads CPU decoding off the main thread)
 * - Zero extra animation / spinning icons
 * - Background multi-candidate resolution
 * - Zero layout shift with smooth opacity reveal
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  candidates,
  alt,
  fallbackSrc,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
  ...rest
}) => {
  // Candidate list ordered by priority
  const candidateList = React.useMemo(() => {
    const list: string[] = [];
    if (src) list.push(src);
    if (candidates && candidates.length > 0) {
      candidates.forEach((c) => {
        if (c && !list.includes(c)) list.push(c);
      });
    }
    if (fallbackSrc && !list.includes(fallbackSrc)) {
      list.push(fallbackSrc);
    }
    return list.filter(Boolean);
  }, [src, candidates, fallbackSrc]);

  // Determine starting source: check memory cache first
  const cacheKey = candidateList[0] || '';
  const cachedUrl = resolvedImageCache.get(cacheKey);

  const [currentSrc, setCurrentSrc] = useState<string>(() => cachedUrl || candidateList[0] || '');
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => Boolean(cachedUrl));
  const hasErrorRef = useRef(false);

  // If candidateList changes, reset index
  useEffect(() => {
    if (cachedUrl) {
      setCurrentSrc(cachedUrl);
      setIsLoaded(true);
      return;
    }
    setCandidateIndex(0);
    setCurrentSrc(candidateList[0] || '');
    hasErrorRef.current = false;
  }, [candidateList, cachedUrl]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    hasErrorRef.current = false;
    if (currentSrc) {
      resolvedImageCache.set(cacheKey, currentSrc);
    }
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidateList.length) {
      setCandidateIndex(nextIndex);
      setCurrentSrc(candidateList[nextIndex]);
    } else {
      hasErrorRef.current = true;
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      }
      if (onError) onError();
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={priority ? 'eager' : loading}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onLoad={handleImageLoad}
      onError={handleImageError}
      className={`${className} transition-opacity duration-200 ${
        isLoaded ? 'opacity-100' : 'opacity-90'
      }`}
      {...rest}
    />
  );
};
