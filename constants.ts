import { PadData } from './types';

const KEY_MAP: string[] = [
  'q', 'w', 'e', 'r',
  'a', 's', 'd', 'f',
  'z', 'x', 'c', 'v',
  '1', '2', '3', '4',
];

const PAD_COLORS: string[] = [
  'bg-gray-500', 'bg-gray-500', 'bg-gray-500', 'bg-gray-500',
  'bg-gray-500', 'bg-gray-500', 'bg-gray-500', 'bg-gray-500',
  'bg-gray-500', 'bg-gray-500', 'bg-gray-500', 'bg-gray-500',
  'bg-gray-500', 'bg-gray-500', 'bg-gray-500', 'bg-gray-500',
];

export const INITIAL_PADS: PadData[] = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  keyTrigger: KEY_MAP[i],
  sound: null,
  name: `PAD ${i + 1}`,
  color: PAD_COLORS[i],
  isLooping: false,
}));
