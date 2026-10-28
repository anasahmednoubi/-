import React from 'react';

export const ICO_PATHS: Record<string, string> = {
  chevdown: '<path d="m6 9 6 6 6-6"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  pen: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  laptop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  dumbbell: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  bike: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  coffee: '<path d="M10 2v2M14 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1M6 2v2"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  apple: '<path d="M12 7c-1-2-3-3-5-2-3 1.5-3 6-1 10 1.5 3 3 5 4.5 5 1 0 1-.5 1.5-.5s.5.5 1.5.5c1.5 0 3-2 4.5-5 2-4 2-8.5-1-10-2-1-4 0-5 2zM12 7c0-2 1-4 3-5"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  dollar: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  gamepad: '<path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/><rect x="2" y="6" width="20" height="12" rx="4"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  sprout: '<path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  pin: '<path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  week: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h8"/>',
  month: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  dots: '<circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  swap: '<path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  umbrella: '<path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0M12 2v1"/>',
  snow: '<path d="M2 12h20M12 2v20m4-18-4 4-4-4m8 16-4-4-4 4M20 16l-4-4 4-4M4 8l4 4-4 4"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  tree: '<path d="m12 3-6 8h3l-4 6h14l-4-6h3z"/><path d="M12 17v5"/>',
  headphones: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15v3a2 2 0 0 1-2 2h-1v-6h3zM3 15v3a2 2 0 0 0 2 2h1v-6H3z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
  package: '<path d="m7.5 4.27 9 5.15M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  mappin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  train: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M8 15h.01M16 15h.01"/>',
  bus: '<path d="M8 6v6M16 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  paw: '<circle cx="5" cy="9" r="2"/><circle cx="10" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19" cy="9" r="2"/><path d="M8 16c0-2.5 2-5 4-5s4 2.5 4 5-1.5 4-4 4-4-1.5-4-4z"/>',
  thermo: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  glasses: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-4 0M2.5 13 5 7c.7-1.3 1.4-2 3-2M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>',
  flag: '<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-1.04 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98 1.04 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
  crown: '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zM5 20h14"/>',
  stopwatch: '<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
  listchecks: '<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
  flask: '<path d="M10 2v7.31L4.5 20a1 1 0 0 0 .9 1.5h13.2a1 1 0 0 0 .9-1.5L14 9.31V2M8.5 2h7M7 16h10"/>',
  thumbs: '<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z"/>',
};

export const ICK: [string, string][] = [
  ["book", "كتاب كتب مذاكرة دراسة قراءة تعلم book study read"],
  ["pen", "كتابة تدوين ملاحظات write note"],
  ["laptop", "كمبيوتر لابتوب برمجة شغل code laptop work"],
  ["phone", "موبايل تليفون اتصال مكالمة phone call"],
  ["briefcase", "شغل وظيفة عمل شركة مكتب job work office"],
  ["target", "هدف تركيز target goal"],
  ["calendar", "تقويم موعد يوم calendar"],
  ["clock", "منبه ساعة وقت alarm time clock"],
  ["dumbbell", "رياضة تمرين جيم عضلات حديد gym workout weights"],
  ["activity", "جري ركض مشي صحة run walk health"],
  ["bike", "عجلة دراجة bike"],
  ["droplet", "ميه ماء شرب سباحة water drink swim"],
  ["coffee", "قهوة شاي coffee tea"],
  ["utensils", "اكل غدا عشا فطار طعام food meal breakfast"],
  ["apple", "تفاح فاكهة دايت apple fruit diet"],
  ["cart", "تسوق سوق شراء بقاله shop groceries"],
  ["sparkles", "تنظيف كنس غسيل clean laundry"],
  ["bed", "نوم سرير sleep bed"],
  ["moon", "قمر ليل صلاة دعاء اذكار moon night pray"],
  ["sun", "شمس صباح صحيان sun morning"],
  ["pill", "دواء علاج حبوب فيتامين pill medicine"],
  ["car", "عربية سيارة سواقة car"],
  ["plane", "سفر طيارة travel plane"],
  ["home", "بيت منزل home house"],
  ["dollar", "فلوس مال ميزانية بنك money bank"],
  ["palette", "رسم فن تلوين art paint draw"],
  ["music", "موسيقى اغنية جيتار بيانو music guitar piano"],
  ["gamepad", "العاب لعب بلاي game play chess"],
  ["camera", "تصوير كاميرا فيلم سينما photo camera movie"],
  ["sprout", "زرع نبات حديقة ورد plant garden flower"],
  ["user", "طفل بيبي شخص ولد baby child person user"],
  ["heart", "حب قلب love heart"],
  ["smile", "سعادة ابتسامة تأمل يوجا happy smile yoga meditate"],
  ["gift", "هدية عيد ميلاد gift birthday"],
  ["flame", "حماس نار flame fire streak"],
  ["star", "نجمة مهم star important"],
  ["bulb", "فكرة تفكير idea think"],
  ["bell", "تنبيه bell"],
  ["globe", "لغات عالم لغة world language"],
  ["repeat", "تكرار روتين repeat routine"],
  ["pin", "مهمة تثبيت pin task"],
  ["check", "تم انجاز صح done check"],
  ["chart", "احصائيات تقرير chart stats"],
  ["week", "اسبوع week"],
  ["month", "شهر month"],
  ["cloud", "غيم سحاب طقس cloud weather"],
  ["umbrella", "مطر شمسية umbrella rain"],
  ["snow", "ثلج برد شتا snow cold"],
  ["zap", "طاقة كهرباء برق energy zap"],
  ["mountain", "جبل طبيعة رحلة hiking mountain"],
  ["tree", "شجرة طبيعة tree nature"],
  ["headphones", "سماعة بودكاست headphones podcast"],
  ["mic", "ميكروفون تسجيل صوت mic record"],
  ["video", "فيديو مونتاج video"],
  ["image", "صورة صور image photo"],
  ["mail", "ايميل رسالة بريد mail email"],
  ["message", "محادثة شات رد message chat"],
  ["users", "اصحاب عيلة اجتماع زيارة friends family meeting"],
  ["shield", "حماية امان shield safe"],
  ["lock", "قفل خصوصية lock"],
  ["key", "مفتاح key"],
  ["wrench", "صيانة تصليح fix repair tool"],
  ["scissors", "قص حلاقة حلاق scissors haircut"],
  ["package", "طرد شحن package delivery"],
  ["mappin", "مكان موقع خريطة place location"],
  ["train", "قطر مترو train metro"],
  ["bus", "اتوبيس باص bus"],
  ["shirt", "هدوم لبس ملابس shirt clothes"],
  ["paw", "كلب قطة حيوان اليف dog cat pet paw"],
  ["thermo", "حرارة سخونية حمى temperature fever"],
  ["eye", "عين نظر مشاهدة eye watch"],
  ["glasses", "نظارة glasses"],
  ["flag", "علم هدف علامة flag"],
  ["trophy", "كاس بطولة فوز كورة trophy win football soccer"],
  ["crown", "تاج ملك crown"],
  ["stopwatch", "ستوب ووتش توقيت stopwatch timer"],
  ["listchecks", "قائمة مهام checklist todo"],
  ["clipboard", "لوحة تقرير clipboard report"],
  ["file", "ملف مستند ورق file document"],
  ["folder", "فولدر مجلد folder"],
  ["bookmark", "علامة مرجعية حفظ bookmark save"],
  ["wallet", "محفظة wallet"],
  ["card", "بطاقة فيزا دفع card pay"],
  ["trend", "استثمار نمو ارباح invest growth"],
  ["calc", "حساب رياضيات حاسبة math calculator"],
  ["flask", "علوم تجربة معمل science lab"],
  ["thumbs", "اعجاب موافق like good"],
];

export const EMAP: Record<string, string> = {
  "📚": "book", "📖": "book", "🎓": "book", "✍": "pen", "📝": "pen", "💻": "laptop",
  "📱": "phone", "📞": "phone", "💼": "briefcase", "🏢": "briefcase", "🎯": "target",
  "📅": "calendar", "⏰": "clock", "⏳": "clock", "💪": "dumbbell", "🏋": "dumbbell",
  "🥊": "dumbbell", "🏃": "activity", "🚶": "activity", "🚴": "bike", "💧": "droplet",
  "🏊": "droplet", "☕": "coffee", "🍽": "utensils", "🍳": "utensils", "🍕": "utensils",
  "🥗": "utensils", "🥦": "utensils", "🍎": "apple", "🛒": "cart", "🧹": "sparkles",
  "🧺": "sparkles", "🧼": "sparkles", "🧴": "sparkles", "🛏": "bed", "😴": "bed",
  "🌙": "moon", "🕌": "moon", "🤲": "moon", "📿": "moon", "🙏": "moon", "☀": "sun",
  "💊": "pill", "🩺": "pill", "🦷": "pill", "🪥": "pill", "🚗": "car", "✈": "plane",
  "🏠": "home", "💰": "dollar", "💳": "dollar", "🏦": "dollar", "🧾": "dollar",
  "🎨": "palette", "🎵": "music", "🎸": "music", "🎹": "music", "🎮": "gamepad",
  "♟": "gamepad", "📷": "camera", "🎬": "camera", "📺": "camera", "🌱": "sprout",
  "🌸": "sprout", "🌿": "sprout", "👶": "user", "❤": "heart", "😊": "smile",
  "🧘": "smile", "😀": "smile", "🎁": "gift", "🎂": "gift", "🔥": "flame",
  "⭐": "star", "💡": "bulb", "🧠": "bulb", "🔔": "bell", "🌍": "globe",
  "🗣": "globe", "🔁": "repeat", "📌": "pin", "✅": "check", "✓": "check",
  "✔": "check", "📊": "chart", "📈": "chart", "📆": "week", "🗓": "month",
  "⋮": "dots", "✕": "x", "🗑": "trash", "☰": "menu", "🔍": "search", "↕": "swap"
};

export function getIconName(val?: string): string | null {
  if (!val) return null;
  const clean = String(val).trim();
  if (clean.startsWith('i:')) {
    return clean.slice(2);
  }
  const em = EMAP[clean.replace(/\uFE0F/g, '')];
  return em || null;
}

export const Icon: React.FC<{
  name?: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ name, size = '1em', className = 'ic', style }) => {
  const iconKey = getIconName(name);
  if (iconKey && ICO_PATHS[iconKey]) {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: ICO_PATHS[iconKey] }}
      />
    );
  }
  return <span className={className} style={style}>{name || ''}</span>;
};
