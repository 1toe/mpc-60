
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PadData, RecordedNote } from './types';
import { INITIAL_PADS } from './constants';
import { PadProvider } from './context/PadContext';
import PadGrid from './components/PadGrid';
import InfoPanel from './components/InfoPanel';
import ControlPanel from './components/ControlPanel';
import { exportToWav } from './utils/audioExport';

const App: React.FC = () => {
  const [pads, setPads] = useState<PadData[]>(INITIAL_PADS);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState<RecordedNote[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  // Metronome state
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [bpm, setBpm] = useState(120);
  const metronomeAudioContextRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<number | null>(null);

  // UI state
  const [isExporting, setIsExporting] = useState(false);

  const handleUpdatePad = useCallback((id: number, data: Partial<PadData>) => {
    setPads(prevPads =>
      prevPads.map(pad =>
        pad.id === id ? { ...pad, ...data } : pad
      )
    );
  }, []);

  const handlePadPlay = useCallback((padId: number) => {
    if (isRecording) {
      const time = performance.now() - recordingStartTimeRef.current;
      setRecordedSequence(prev => [...prev, { padId, time }]);
    }
  }, [isRecording]);

  const handleRecordToggle = () => {
    const nextIsRecording = !isRecording;
    setIsRecording(nextIsRecording);

    if (nextIsRecording) {
      setRecordedSequence([]);
      recordingStartTimeRef.current = performance.now();
    }
  };

  useEffect(() => {
    const clearMetronomeInterval = () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
    };

    if (isMetronomeOn) {
      if (!metronomeAudioContextRef.current) {
        metronomeAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const context = metronomeAudioContextRef.current;
      const interval = (60 / bpm) * 1000;

      clearMetronomeInterval();

      metronomeIntervalRef.current = window.setInterval(() => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.frequency.setValueAtTime(880, context.currentTime); // A5
        gain.gain.setValueAtTime(1, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(context.currentTime);
        osc.stop(context.currentTime + 0.05);
      }, interval);

    } else {
      clearMetronomeInterval();
    }

    return () => clearMetronomeInterval();
  }, [isMetronomeOn, bpm]);

  const handlePlayback = () => {
    if (recordedSequence.length === 0 || isRecording) return;
    recordedSequence.forEach(note => {
      setTimeout(() => {
        const pad = pads.find(p => p.id === note.padId);
        if (pad?.sound) {
          pad.sound.currentTime = 0;
          pad.sound.play().catch(e => console.error("Error playing sound on playback", e));
        }
      }, note.time);
    });
  };

  const handleExport = async () => {
    if (recordedSequence.length === 0 || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await exportToWav(recordedSequence, pads);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'react-mpc60-recording.wav';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("No audio to export. Make sure the pads you used have samples loaded.");
      }
    } catch (error) {
      console.error("Failed to export WAV:", error);
      alert(`Failed to export recording. See console for details.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PadProvider pads={pads} onUpdatePad={handleUpdatePad} onPlayPad={handlePadPlay}>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-stone-300 shadow-2xl rounded-lg p-6 border-4 border-black/50">
          <div className="flex flex-col lg:flex-row gap-6">
            <InfoPanel />
            <div className="flex-grow bg-stone-400 p-6 rounded-lg shadow-inner">
              <PadGrid />
            </div>
          </div>
          <ControlPanel
            status={{
              isRecording,
              isMetronomeOn,
              hasRecording: recordedSequence.length > 0,
              isExporting,
            }}
            bpm={bpm}
            onRecordToggle={handleRecordToggle}
            onPlayback={handlePlayback}
            onExport={handleExport}
            onMetronomeToggle={() => setIsMetronomeOn(prev => !prev)}
            onBpmChange={(newBpm) => setBpm(Math.max(40, Math.min(240, newBpm)))}
          />
        </div>
      </div>
    </PadProvider>
  );
};

export default App;
