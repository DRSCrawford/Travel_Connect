/**
 * Travel Connect - Global Configuration Constants
 */

export const CONFIG = {
  // Initial Player State
  STARTING_MONEY: 1500,
  STARTING_COUNTRY: 'ZA', // South Africa

  // Overcrowding Penalties
  OVERCROWD_TIME_LIMIT: 10000, // 10 seconds before penalty kicks in
  OVERCROWD_PENALTY_PER_SEC: 25, // $25 lost per second per overcrowded terminal

  // Road Lane Tiers & Properties
  ROAD_TYPES: {
    GRAVEL: {
      name: 'Gravel Track',
      speedLimit: 60,      // km/h equivalent
      maxVehicles: 2,
      buildCost: 150,
      color: '#a16207',    // Muted amber
      width: 2,
      dash: [4, 4]
    },
    SINGLE_LANE: {
      name: 'Single Lane Road',
      speedLimit: 80,
      maxVehicles: 4,
      buildCost: 350,
      color: '#64748b',    // Slate grey
      width: 3,
      dash: [8, 4]
    },
    MAIN_ROAD: {
      name: 'Main Tar Road',
      speedLimit: 100,
      maxVehicles: 6,
      buildCost: 850,
      color: '#38bdf8',    // Sky blue
      width: 4,
      dash: []
    },
    HIGHWAY: {
      name: 'Multi-Lane Highway',
      speedLimit: 120,
      maxVehicles: 8,
      buildCost: 1800,
      color: '#f59e0b',    // Amber / Gold
      width: 6,
      dash: []
    }
  },

  // Vehicle Tiers & Specs
  VEHICLES: {
    MINIBUS: {
      name: 'Minibus Taxi',
      capacity: 12,
      baseSpeed: 0.005,
      cost: 200,
      color: '#eab308'     // Yellow
    },
    COACH: {
      name: 'Express Coach Bus',
      capacity: 30,
      baseSpeed: 0.007,
      cost: 600,
      color: '#10b981'     // Emerald green
    },
    HAULER: {
      name: 'Heavy Transport Bus',
      capacity: 50,
      baseSpeed: 0.004,
      cost: 1200,
      color: '#ec4899'     // Pink / Magenta
    }
  },

  // Border Customs Checkpoint Delays
  BORDER_CROSSING: {
    DEFAULT_DELAY_MS: 3000,  // 3 seconds delay at border queue
    UNLOCK_COST_BASE: 500   // Base cost to unlock a neighboring border gate
  },

  // Fare Payout Balancing
  FARE_PER_KM: 2.5
};