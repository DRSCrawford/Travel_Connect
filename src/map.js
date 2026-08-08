/**
 * Travel Connect - African Continent Map & Region Data
 */

export const COUNTRIES = {
  ZA: {
    id: 'ZA',
    name: 'South Africa',
    unlocked: true,
    unlockCost: 0,
    color: 'rgba(56, 189, 248, 0.15)', // Active sky blue highlight
    stroke: '#38bdf8',
    // Border polygon points (scaled to 1000x700 canvas)
    polygon: [
      { x: 380, y: 550 },
      { x: 520, y: 540 },
      { x: 580, y: 580 },
      { x: 550, y: 670 },
      { x: 420, y: 680 },
      { x: 350, y: 620 }
    ],
    neighbors: ['NA', 'BW', 'MZ']
  },
  NA: {
    id: 'NA',
    name: 'Namibia',
    unlocked: false,
    unlockCost: 500,
    color: 'rgba(100, 116, 139, 0.1)',
    stroke: '#475569',
    polygon: [
      { x: 260, y: 440 },
      { x: 380, y: 440 },
      { x: 380, y: 550 },
      { x: 350, y: 620 },
      { x: 260, y: 550 }
    ],
    neighbors: ['ZA', 'BW', 'AO']
  },
  BW: {
    id: 'BW',
    name: 'Botswana',
    unlocked: false,
    unlockCost: 650,
    color: 'rgba(100, 116, 139, 0.1)',
    stroke: '#475569',
    polygon: [
      { x: 380, y: 440 },
      { x: 500, y: 430 },
      { x: 520, y: 540 },
      { x: 380, y: 550 }
    ],
    neighbors: ['ZA', 'NA', 'ZW']
  },
  MZ: {
    id: 'MZ',
    name: 'Mozambique',
    unlocked: false,
    unlockCost: 800,
    color: 'rgba(100, 116, 139, 0.1)',
    stroke: '#475569',
    polygon: [
      { x: 520, y: 420 },
      { x: 620, y: 380 },
      { x: 640, y: 520 },
      { x: 580, y: 580 },
      { x: 520, y: 540 }
    ],
    neighbors: ['ZA', 'ZW', 'TZ']
  },
  ZW: {
    id: 'ZW',
    name: 'Zimbabwe',
    unlocked: false,
    unlockCost: 750,
    color: 'rgba(100, 116, 139, 0.1)',
    stroke: '#475569',
    polygon: [
      { x: 500, y: 430 },
      { x: 580, y: 410 },
      { x: 560, y: 480 },
      { x: 520, y: 490 }
    ],
    neighbors: ['BW', 'MZ', 'ZM']
  },
  TZ: {
    id: 'TZ',
    name: 'Tanzania',
    unlocked: false,
    unlockCost: 1200,
    color: 'rgba(100, 116, 139, 0.1)',
    stroke: '#475569',
    polygon: [
      { x: 580, y: 280 },
      { x: 680, y: 270 },
      { x: 650, y: 370 },
      { x: 570, y: 350 }
    ],
    neighbors: ['MZ', 'KE']
  },
  KE: {
    id: 'KE',
    name: 'Kenya',
    unlocked: false,
    unlockCost: 1600,
    color: 'rgba(100, 116, 139, 0.1)',
    stroke: '#475569',
    polygon: [
      { x: 620, y: 180 },
      { x: 720, y: 190 },
      { x: 680, y: 270 },
      { x: 580, y: 280 }
    ],
    neighbors: ['TZ']
  }
};

export const CITIES = {
  CPT: { id: 'CPT', name: 'Cape Town', country: 'ZA', x: 390, y: 660, isCapital: false },
  JNB: { id: 'JNB', name: 'Johannesburg', country: 'ZA', x: 480, y: 590, isCapital: false },
  DUR: { id: 'DUR', name: 'Durban', country: 'ZA', x: 530, y: 620, isCapital: false },
  
  WDH: { id: 'WDH', name: 'Windhoek', country: 'NA', x: 310, y: 510, isCapital: true },
  GBE: { id: 'GBE', name: 'Gaborone', country: 'BW', x: 450, y: 520, isCapital: true },
  MPM: { id: 'MPM', name: 'Maputo', country: 'MZ', x: 550, y: 560, isCapital: true },
  HRE: { id: 'HRE', name: 'Harare', country: 'ZW', x: 540, y: 440, isCapital: true },
  DAR: { id: 'DAR', name: 'Dar es Salaam', country: 'TZ', x: 640, y: 320, isCapital: false },
  NBO: { id: 'NBO', name: 'Nairobi', country: 'KE', x: 650, y: 230, isCapital: true }
};

export const BORDER_GATES = [
  { id: 'ZA-NA', countryA: 'ZA', countryB: 'NA', x: 360, y: 585, unlocked: false },
  { id: 'ZA-BW', countryA: 'ZA', countryB: 'BW', x: 465, y: 555, unlocked: false },
  { id: 'ZA-MZ', countryA: 'ZA', countryB: 'MZ', x: 535, y: 565, unlocked: false },
  { id: 'BW-ZW', countryA: 'BW', countryB: 'ZW', x: 510, y: 460, unlocked: false },
  { id: 'MZ-TZ', countryA: 'MZ', countryB: 'TZ', x: 605, y: 365, unlocked: false },
  { id: 'TZ-KE', countryA: 'TZ', countryB: 'KE', x: 635, y: 275, unlocked: false }
];