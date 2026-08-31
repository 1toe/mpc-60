
import React from 'react';

// SVG Icons as components for better reusability and styling
const RecordIcon = ({ isRecording }: { isRecording: boolean }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all ${isRecording ? 'text-red-500 animate-pulse' : 'text-red-700'}`}
      aria-hidden="true"
    >
        {isRecording ? <rect x="6" y="6" width="12" height="12" rx="2" /> : <circle cx="12" cy="12" r="8" />}
    </svg>
);

const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 5V19L19 12L8 5Z" />
    </svg>
);

const MetronomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2L2 22h20L12 2z"></path><path d="M4 15h16"></path><path d="M12 2v20"></path>
    </svg>
);

const ExportIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z" />
    </svg>
);

interface ControlPanelStatus {
    isRecording: boolean;
    isMetronomeOn: boolean;
    hasRecording: boolean;
    isExporting: boolean;
}

interface ControlPanelProps {
    status: ControlPanelStatus;
    bpm: number;
    onRecordToggle: () => void;
    onPlayback: () => void;
    onExport: () => void;
    onMetronomeToggle: () => void;
    onBpmChange: (bpm: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    status,
    bpm,
    onRecordToggle,
    onPlayback,
    onExport,
    onMetronomeToggle,
    onBpmChange,
}) => {
    const { isRecording, isMetronomeOn, hasRecording, isExporting } = status;
    const buttonClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-md shadow-md transition-all duration-150 ease-in-out border border-black/20 disabled:opacity-50 disabled:cursor-not-allowed";
    const activeClass = "bg-yellow-400 shadow-inner";

    return (
        <div className="bg-stone-500 p-4 rounded-b-lg -m-6 mt-4 border-t-4 border-black/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <button onClick={onRecordToggle} className={`${buttonClasses} ${isRecording ? 'bg-red-300' : 'bg-stone-300 hover:bg-stone-400'}`} aria-label={isRecording ? 'Stop recording' : 'Start recording'} aria-pressed={isRecording}>
                    <RecordIcon isRecording={isRecording} />
                    <span className="font-bold text-sm" aria-hidden="true">{isRecording ? 'STOP' : 'REC'}</span>
                </button>
                <button onClick={onPlayback} disabled={!hasRecording || isRecording} className={`${buttonClasses} bg-stone-300 hover:bg-stone-400`} aria-label="Play back recording">
                    <PlayIcon />
                    <span className="font-bold text-sm" aria-hidden="true">PLAY</span>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <button
                  onClick={onMetronomeToggle}
                  className={`${buttonClasses} ${isMetronomeOn ? activeClass : 'bg-stone-300 hover:bg-stone-400'}`}
                  aria-label={isMetronomeOn ? 'Turn metronome off' : 'Turn metronome on'}
                  aria-pressed={isMetronomeOn}
                >
                    <MetronomeIcon />
                </button>
                <div className="flex items-center gap-2">
                    <label htmlFor="bpm" className="text-sm font-bold text-gray-800">BPM</label>
                    <input
                        id="bpm"
                        type="number"
                        min="40"
                        max="240"
                        value={bpm}
                        onChange={(e) => onBpmChange(parseInt(e.target.value, 10))}
                        className="w-20 bg-gray-200 border border-black/20 rounded-md p-2 text-center font-mono font-bold text-lg shadow-inner"
                        aria-label="Beats per minute"
                    />
                </div>
            </div>

            <button onClick={onExport} disabled={!hasRecording || isRecording || isExporting} className={`${buttonClasses} bg-blue-500 text-white hover:bg-blue-600`} aria-label={isExporting ? 'Exporting WAV file' : 'Export recording as WAV'}>
                <ExportIcon />
                <span className="font-bold text-sm" aria-hidden="true">{isExporting ? 'EXPORTING...' : 'EXPORT WAV'}</span>
            </button>
        </div>
    );
};

export default ControlPanel;
