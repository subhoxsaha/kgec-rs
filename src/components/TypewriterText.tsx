import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 12,
  className = '',
  onComplete,
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    setDisplayedLength(0);
    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedLength(index);
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  const isComplete = displayedLength >= text.length;

  return (
    <span
      className={`inline ${className} cursor-pointer`}
      onClick={() => setDisplayedLength(text.length)}
      title="Tap to reveal full text"
    >
      {text.slice(0, displayedLength)}
      {!isComplete && (
        <span className="inline-block w-1.5 h-3 ml-0.5 bg-emerald-500 animate-pulse align-middle" />
      )}
    </span>
  );
};
