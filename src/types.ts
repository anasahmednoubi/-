export interface TaskHistory {
  d: string;
  a: number;
  m?: number;
}

export interface Task {
  id: number;
  icon?: string;
  name: string;
  target: number;
  unit: string;
  daily: number;
  done: number;
  finished: boolean;
  fin?: string;
  dk?: string;
  dadd?: number;
  hist?: TaskHistory[];
}

export interface Routine {
  id: number;
  icon?: string;
  name: string;
  days: number[]; // 0: Sun, 1: Mon, ... 6: Sat
  mode: 'W' | 'M';
  md?: number[]; // days of month: 1..31
  log: Record<string, boolean>; // key 'YYYY-MM-DD' => true
  created: string; // key 'YYYY-MM-DD'
}

export type TabType = 'D' | 'T' | 'R' | 'S' | 'H';
export type PeriodType = 'W' | 'M';
export type ThemeType = 'auto' | 'light' | 'dark';
export type TabPosType = 'bottom' | 'top';
export type PbStyleType = 'gauge' | 'ring' | 'half' | 'bar' | 'segments';
export type ToneType = 'chime' | 'bell' | 'pop' | 'melody' | 'beep' | 'off';

export interface UserProfile {
  name: string;
}

export interface FontConfig {
  f: string;
  s: number;
}

export interface AccountLinks {
  g?: string;
  f?: string;
  last?: string;
}
