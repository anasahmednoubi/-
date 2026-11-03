import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// SVGs for the icons
const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="108" height="108">
  <defs>
    <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Inactive circular track -->
  <circle cx="54" cy="55" r="19.5" fill="none" stroke="#8b5cf6" stroke-opacity="0.3" stroke-width="5.5"/>

  <!-- Active progress arc (matching in-app 75% arc) -->
  <circle cx="54" cy="55" r="19.5" fill="none" stroke="url(#glowGrad)" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="92 123" transform="rotate(-90 54 55)" filter="url(#softGlow)"/>

  <!-- Checkmark -->
  <path d="M46.2 55.8 L51.8 61.4 L62.5 49.5" fill="none" stroke="url(#glowGrad)" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#softGlow)"/>

  <!-- Sparkle star at top right -->
  <path d="M72.5 30 L74 34.2 L78.2 35.7 L74 37.2 L72.5 41.4 L71 37.2 L66.8 35.7 L71 34.2 Z" fill="#c084fc" filter="url(#softGlow)"/>
</svg>
`;

const squareIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="108" height="108">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f1b2e"/>
      <stop offset="100%" stop-color="#13111b"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6d28d9" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Squircle container matching in-app badge -->
  <rect x="5" y="5" width="98" height="98" rx="28" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="2.5"/>

  <!-- Inactive circular track -->
  <circle cx="54" cy="55" r="22" fill="none" stroke="#8b5cf6" stroke-opacity="0.3" stroke-width="6"/>

  <!-- Active progress arc -->
  <circle cx="54" cy="55" r="22" fill="none" stroke="url(#glowGrad)" stroke-width="6" stroke-linecap="round" stroke-dasharray="104 138" transform="rotate(-90 54 55)" filter="url(#softGlow)"/>

  <!-- Checkmark -->
  <path d="M45.2 56 L51.5 62.3 L63.6 48.8" fill="none" stroke="url(#glowGrad)" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#softGlow)"/>

  <!-- Sparkle star at top right -->
  <path d="M75 27 L76.7 31.7 L81.4 33.4 L76.7 35.1 L75 39.8 L73.3 35.1 L68.6 33.4 L73.3 31.7 Z" fill="#c084fc" filter="url(#softGlow)"/>
</svg>
`;

const roundIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="108" height="108">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f1b2e"/>
      <stop offset="100%" stop-color="#13111b"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6d28d9" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Round container -->
  <circle cx="54" cy="54" r="49" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="2.5"/>

  <!-- Inactive circular track -->
  <circle cx="54" cy="55" r="22" fill="none" stroke="#8b5cf6" stroke-opacity="0.3" stroke-width="6"/>

  <!-- Active progress arc -->
  <circle cx="54" cy="55" r="22" fill="none" stroke="url(#glowGrad)" stroke-width="6" stroke-linecap="round" stroke-dasharray="104 138" transform="rotate(-90 54 55)" filter="url(#softGlow)"/>

  <!-- Checkmark -->
  <path d="M45.2 56 L51.5 62.3 L63.6 48.8" fill="none" stroke="url(#glowGrad)" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#softGlow)"/>

  <!-- Sparkle star at top right -->
  <path d="M75 27 L76.7 31.7 L81.4 33.4 L76.7 35.1 L75 39.8 L73.3 35.1 L68.6 33.4 L73.3 31.7 Z" fill="#c084fc" filter="url(#softGlow)"/>
</svg>
`;

async function generate() {
  const densities = [
    { dir: 'mipmap-mdpi', iconSize: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', iconSize: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', iconSize: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', iconSize: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', iconSize: 192, fgSize: 432 },
  ];

  const baseRes = path.resolve('android/app/src/main/res');

  for (const d of densities) {
    const targetDir = path.join(baseRes, d.dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // 1. ic_launcher.png
    await sharp(Buffer.from(squareIconSvg))
      .resize(d.iconSize, d.iconSize)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // 2. ic_launcher_round.png
    await sharp(Buffer.from(roundIconSvg))
      .resize(d.iconSize, d.iconSize)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // 3. ic_launcher_foreground.png
    await sharp(Buffer.from(foregroundSvg))
      .resize(d.fgSize, d.fgSize)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`Generated icons for ${d.dir} (icon: ${d.iconSize}x${d.iconSize}, fg: ${d.fgSize}x${d.fgSize})`);
  }

  // Also generate 512x512 app store / web icon
  const publicDir = path.resolve('public');
  await sharp(Buffer.from(squareIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(Buffer.from(squareIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  console.log('Finished icon generation successfully.');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
