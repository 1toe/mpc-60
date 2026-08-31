import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PadData } from '../types';
import { usePadContext } from '../context/PadContext';

interface PadProps {
  padData: PadData;
}

const LoopIcon: React.FC = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
);


const Pad: React.FC<PadProps> = ({ padData }) => {
  const { onUpdatePad, onPlayPad } = usePadContext();
  const [isActive, setIsActive] = useState(false); // For one-shot flash
  const [isLoopPlaying, setIsLoopPlaying] = useState(false); // For loop glow
  const fileInputRef = useRef<HTMLInputElement>(null);

  const playSound = useCallback(() => {
    if (!padData.sound) {
      fileInputRef.current?.click();
      return;
    }

    if (padData.isLooping) {
      if (isLoopPlaying) {
        padData.sound.pause();
        padData.sound.currentTime = 0;
        setIsLoopPlaying(false);
      } else {
        onPlayPad(padData.id); // Record the start of the loop
        padData.sound.loop = true;
        padData.sound.play().catch(e => console.error("Error playing loop:", e));
        setIsLoopPlaying(true);
      }
    } else {
      // Play one-shot
      onPlayPad(padData.id);
      padData.sound.loop = false;
      padData.sound.currentTime = 0;
      padData.sound.play().catch(e => console.error("Error playing sound:", e));
      setIsActive(true);
      setTimeout(() => setIsActive(false), 150);
    }
  }, [padData.id, padData.sound, padData.isLooping, isLoopPlaying, onPlayPad]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === padData.keyTrigger) {
        playSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [padData.keyTrigger, playSound]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (padData.sound) {
          padData.sound.pause();
      }
      // Stop loop playback when a new file is loaded
      setIsLoopPlaying(false);

      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      onUpdatePad(padData.id, { sound: audio, name: file.name, file, isLooping: false });
    }
  };

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoopToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIsLooping = !padData.isLooping;
    // If disabling loop while currently playing, stop the audio immediately
    if (!nextIsLooping && isLoopPlaying && padData.sound) {
      padData.sound.pause();
      padData.sound.currentTime = 0;
      setIsLoopPlaying(false);
    }
    onUpdatePad(padData.id, { isLooping: nextIsLooping });
  };

  const handlePadKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      playSound();
    }
  };

  const padAriaLabel = `${padData.name}${padData.sound ? `, key ${padData.keyTrigger.toUpperCase()}` : ', no sample loaded — click to load'}`;

  const padClasses = `
    relative flex flex-col justify-between items-center w-full h-full rounded-lg shadow-lg cursor-pointer transition-all duration-150 ease-in-out
    border-2 border-black/20
    ${padData.sound ? 'bg-gray-600' : 'bg-gray-500'}
    ${isLoopPlaying ? 'ring-4 ring-green-500 bg-green-800' : ''}
    ${isActive ? 'transform scale-95 shadow-inner bg-red-600' : (isLoopPlaying ? '' : 'hover:bg-gray-700')}
  `;

  return (
    <div
      className={padClasses}
      onClick={playSound}
      role="button"
      tabIndex={0}
      aria-label={padAriaLabel}
      aria-pressed={isLoopPlaying}
      onKeyDown={handlePadKeyDown}
    >
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <span className="absolute top-1 right-2 text-xs font-bold text-gray-400" aria-hidden="true">
        {padData.keyTrigger.toUpperCase()}
      </span>

      {padData.sound && (
         <button
            onClick={handleLoopToggle}
            className={`absolute bottom-1 left-1 p-1.5 rounded-full transition-colors duration-200 ${padData.isLooping ? 'bg-red-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-red-500 hover:text-white'}`}
            title={padData.isLooping ? "Disable loop" : "Enable loop"}
            aria-label={padData.isLooping ? "Disable loop" : "Enable loop"}
            aria-pressed={padData.isLooping}
         >
            <LoopIcon />
         </button>
      )}

      <div className="flex-grow flex items-center justify-center">
        <p
          className="text-center text-white text-xs p-1 break-words w-full truncate hover:text-red-300"
          onClick={(e) => {
            e.stopPropagation();
            handleLabelClick();
          }}
          title={padData.name}
          aria-hidden="true"
        >
          {padData.name.length > 20 ? `${padData.name.substring(0, 18)}...` : padData.name}
        </p>
      </div>
    </div>
  );
};

export default Pad;
