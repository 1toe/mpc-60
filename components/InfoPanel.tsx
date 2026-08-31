import React from 'react';

const InfoPanel: React.FC = () => {
  return (
    <div className="w-full lg:w-1/3 bg-stone-300 flex flex-col justify-between">
      <div>
        <div className="flex items-baseline gap-4 mb-4">
          <h1 className="text-3xl font-orbitron font-bold text-red-700 tracking-wider">AKAI</h1>
          <p className="text-gray-700 font-semibold">professional</p>
        </div>

        <div className="bg-green-900/80 border-2 border-black/50 p-3 rounded-md shadow-inner text-green-300 font-mono">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">React-MPC60</h2>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
            </div>
            <p className="text-xs mt-2 opacity-80">16 PADS / USER SAMPLES / REC / LOOP</p>
            <div className="mt-2 h-1 bg-green-300/20 w-full"></div>
        </div>

        <div className="mt-6 text-sm text-gray-800">
            <h3 className="font-bold text-base text-black underline decoration-red-700 decoration-2 underline-offset-4 mb-3">Tutorial</h3>
            <div className="space-y-3">
                <div>
                    <p className="font-bold text-gray-900">1. Load Sound</p>
                    <p className="pl-2 text-gray-700">Click a pad's name (e.g., "PAD 1") to select an audio file.</p>
                </div>
                <div>
                    <p className="font-bold text-gray-900">2. Play Sample</p>
                    <p className="pl-2 text-gray-700">Click a pad or use its key to play the sound once.</p>
                </div>
                <div>
                    <p className="font-bold text-gray-900">3. Loop Sample</p>
                    <ul className="list-none pl-2 text-gray-700 space-y-1 mt-1">
                        <li><span className="text-red-700 font-bold mr-1">&bull;</span>Click the 🔄 icon on a pad to enable looping.</li>
                        <li><span className="text-red-700 font-bold mr-1">&bull;</span>Click the pad to start/stop the loop. It will glow green while playing.</li>
                    </ul>
                </div>
                 <div>
                    <p className="font-bold text-gray-900">4. Record Beat</p>
                    <ul className="list-none pl-2 text-gray-700 space-y-1 mt-1">
                        <li><span className="text-red-700 font-bold mr-1">&bull;</span>Press REC to start recording.</li>
                        <li><span className="text-red-700 font-bold mr-1">&bull;</span>Use the Metronome & BPM controls to keep time.</li>
                        <li><span className="text-red-700 font-bold mr-1">&bull;</span>Press STOP when finished.</li>
                    </ul>
                </div>
                <div>
                    <p className="font-bold text-gray-900">5. Playback & Export</p>
                    <p className="pl-2 text-gray-700">Use PLAY to listen to your recording and EXPORT WAV to save it.</p>
                </div>
            </div>
        </div>
      </div>
      
      <div className="mt-6 lg:mt-0">
        <p className="text-xs text-center text-gray-600 font-orbitron tracking-widest">
            ROGER LINN DESIGN
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
