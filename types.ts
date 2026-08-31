export interface PadData {
  id: number;
  keyTrigger: string;
  sound: HTMLAudioElement | null;
  name: string;
  color: string;
  file?: File;
  isLooping?: boolean;
}

export interface RecordedNote {
  padId: number;
  time: number;
}
