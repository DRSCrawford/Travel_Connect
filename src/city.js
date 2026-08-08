/**
 * Travel Connect - City Terminal & Queue Management
 */

import { CONFIG } from './config.js';

export class City {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.country = data.country;
    this.x = data.x;
    this.y = data.y;
    this.isCapital = data.isCapital;

    // Terminal Queue State
    this.passengers = []; // Array of passenger objects: { destinationId, path: [] }
    this.maxCapacity = data.isCapital ? 25 : 15; // Capitals hold more commuters
    
    // Overcrowding Timer & Penalty Tracking
    this.isOvercrowded = false;
    this.overcrowdStartTime = null;
    this.penaltyActive = false;
  }

  /**
   * Add a new passenger to the terminal queue
   */
  addPassenger(passenger) {
    if (this.passengers.length < this.maxCapacity) {
      this.passengers.push(passenger);
      this.checkOvercrowdState();
      return true;
    }
    return false; // Queue full
  }

  /**
   * Remove passengers matching specific flight/bus leg destinations
   */
  boardPassengers(nextStopId, vehicleCapacity) {
    const boarding = [];
    const remaining = [];

    for (const passenger of this.passengers) {
      // Check if the passenger's next leg matches the vehicle's direction
      const nextLeg = passenger.path && passenger.path.length > 0 ? passenger.path[0] : passenger.destinationId;

      if (nextLeg === nextStopId && boarding.length < vehicleCapacity) {
        // Remove current leg from passenger path
        if (passenger.path && passenger.path.length > 0) {
          passenger.path.shift();
        }
        boarding.push(passenger);
      } else {
        remaining.push(passenger);
      }
    }

    this.passengers = remaining;
    this.checkOvercrowdState();
    return boarding;
  }

  /**
   * Evaluate queue length and trigger overcrowding warning timer
   */
  checkOvercrowdState() {
    const now = Date.now();

    if (this.passengers.length >= this.maxCapacity) {
      if (!this.isOvercrowded) {
        this.isOvercrowded = true;
        this.overcrowdStartTime = now;
      } else if (now - this.overcrowdStartTime >= CONFIG.OVERCROWD_TIME_LIMIT) {
        this.penaltyActive = true;
      }
    } else {
      // Queue cleared below max capacity
      this.isOvercrowded = false;
      this.overcrowdStartTime = null;
      this.penaltyActive = false;
    }
  }

  /**
   * Calculate current penalty rate ($ per second) for HUD display
   */
  getPenaltyRate() {
    return this.penaltyActive ? CONFIG.OVERCROWD_PENALTY_PER_SEC : 0;
  }

  /**
   * Get formatted passenger counts grouped by final destination
   */
  getQueueSummary() {
    const summary = {};
    for (const p of this.passengers) {
      summary[p.destinationId] = (summary[p.destinationId] || 0) + 1;
    }
    return summary;
  }

  /**
   * Render city node, labels, and status rings on canvas
   */
  draw(ctx, isSelected = false, isUnlocked = true) {
    // 1. Overcrowding Danger Aura Ring
    if (this.isOvercrowded) {
      const auraColor = this.penaltyActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = auraColor;
      ctx.fill();
    }

    // 2. Selection Ring
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 26, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 3. City Center Node Circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.isCapital ? 20 : 16, 0, Math.PI * 2);
    ctx.fillStyle = isUnlocked ? '#1e293b' : '#0f172a';
    ctx.strokeStyle = isUnlocked ? '#38bdf8' : '#475569';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // Capital Indicator Dot
    if (this.isCapital) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    }

    // 4. City Name Label
    ctx.fillStyle = isUnlocked ? '#f8fafc' : '#64748b';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y - 28);

    // 5. Queue Status & Capacity Count
    const queueColor = this.penaltyActive ? '#ef4444' : this.isOvercrowded ? '#f59e0b' : '#94a3b8';
    ctx.fillStyle = queueColor;
    ctx.font = '11px sans-serif';
    ctx.fillText(`👥 ${this.passengers.length}/${this.maxCapacity}`, this.x, this.y + 34);
  }
}