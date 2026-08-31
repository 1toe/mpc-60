
import { PadData, RecordedNote } from '../types';

// Converts an AudioBuffer to a WAV file (as a Blob)
function bufferToWave(abuffer: AudioBuffer): Blob {
  const numOfChan = abuffer.numberOfChannels;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels: Float32Array[] = [];
  let i = 0;
  let sample = 0;
  let offset = 0;
  let pos = 0;

  // Write WAV container
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  // Write "fmt " chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // chunk length
  setUint16(1); // PCM format
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // 16-bit
  
  // Write "data" chunk
  setUint32(0x61746164); // "data"
  setUint32(length - offset);

  // Get channel data
  for (i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  // Write interleaved PCM data
  while (pos < abuffer.length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(offset, sample, true);
      offset += 2;
    }
    pos++;
  }

  function setUint16(data: number) {
    view.setUint16(offset, data, true);
    offset += 2;
  }

  function setUint32(data: number) {
    view.setUint32(offset, data, true);
    offset += 4;
  }

  return new Blob([view], { type: 'audio/wav' });
}


export const exportToWav = async (sequence: RecordedNote[], pads: PadData[]): Promise<Blob | null> => {
    if (sequence.length === 0) return null;
    
    // Find the total duration of the recording
    const lastNote = sequence.reduce((max, note) => note.time > max.time ? note : max, sequence[0]);
    const duration = (lastNote.time / 1000) + 2; // Add 2s padding

    const offlineContext = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)({
        numberOfChannels: 2,
        length: 44100 * duration,
        sampleRate: 44100,
    });

    const usedPadIds = new Set(sequence.map(note => note.padId));
    const audioBuffers = new Map<number, AudioBuffer>();
    
    const decodingPromises: Promise<void>[] = [];

    pads.forEach(pad => {
        if (usedPadIds.has(pad.id) && pad.file) {
            const promise = pad.file.arrayBuffer()
                .then(arrayBuffer => offlineContext.decodeAudioData(arrayBuffer))
                .then(decodedData => {
                    audioBuffers.set(pad.id, decodedData);
                });
            decodingPromises.push(promise);
        }
    });

    await Promise.all(decodingPromises);

    sequence.forEach(note => {
        const buffer = audioBuffers.get(note.padId);
        if (buffer) {
            const source = offlineContext.createBufferSource();
            source.buffer = buffer;
            source.connect(offlineContext.destination);
            source.start(note.time / 1000);
        }
    });

    const renderedBuffer = await offlineContext.startRendering();
    return bufferToWave(renderedBuffer);
};
