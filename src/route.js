/**
 * Travel Connect - Road Routes & Border Checkpoints
 */

import { CONFIG } from './config.js';

export class Route {
  constructor(startCity, endCity, roadTypeKey = 'GRAVEL', borderGate = null) {
    this.id = `${startCity.id}-${endCity.id}`;
    this.startCity = startCity;
    this.endCity = endCity;
    
    this.typeKey = roadTypeKey;
    this.type = CONFIG.ROAD_TYPES[roadTypeKey];
    this.borderGate = borderGate; // Associated border gate if crossing countries

    // Calculate Euclidean distance (km proxy)
    this.distance = Math.hypot(endCity.x - startCity.x, endCity.y - startCity.y);
    this.assignedVehicles = [];
  }

  /**
   * Upgrade road tier (e.g. GRAVEL -> SINGLE_LANE -> MAIN_ROAD -> HIGHWAY)
   */
  upgrade(nextTypeKey) {
    if (CONFIG.ROAD_TYPES[nextTypeKey]) {
      this.typeKey = nextTypeKey;
      this.type = CONFIG.ROAD_TYPES[nextTypeKey];
      return true;
    }
    return false;
  }

  /**
   * Check if route can accommodate another vehicle
   */
  canAddVehicle() {
    return this.assignedVehicles.length < this.type.maxVehicles;
  }

  /**
   * Calculate travel time based on distance and current road speed limit
   */
  getTravelTime() {
    return this.distance / this.type.speedLimit;
  }

  /**
   * Render road lanes on canvas with style reflecting tier
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startCity.x, this.startCity.y);
    ctx.lineTo(this.endCity.x, this.endCity.y);
    
    ctx.strokeStyle = this.type.color;
    ctx.lineWidth = this.type.width;
    ctx.setLineDash(this.type.dash);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Draw Customs Border Icon if route crosses a country boundary
    if (this.borderGate) {
      const midX = (this.startCity.x + this.endCity.x) / 2;
      const midY = (this.startCity.y + this.endCity.y) / 2;

      ctx.beginPath();
      ctx.arc(midX, midY, 8, 0, Math.PI * 2);
      ctx.fillStyle = this.borderGate.unlocked ? '#10b981' : '#ef4444';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
  }
}