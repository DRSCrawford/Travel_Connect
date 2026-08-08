/**
 * Travel Connect - Vehicle Movement & Passenger Payload
 */

import { CONFIG } from './config.js';

export class Vehicle {
  constructor(id, vehicleTypeKey, route) {
    this.id = id;
    this.typeKey = vehicleTypeKey;
    this.type = CONFIG.VEHICLES[vehicleTypeKey];
    this.route = route;

    this.passengers = [];
    this.progress = 0;   // 0.0 to 1.0 along route
    this.direction = 1;  // 1: Start -> End, -1: End -> Start
    
    // Border Delay State
    this.isDelayedAtBorder = false;
    this.borderDelayEndTime = 0;
  }

  /**
   * Update vehicle position along route and check for arrival/border stops
   */
  update(deltaTime, onArrival, onCollectFare) {
    // 1. Handle Border Customs Inspection Queue
    if (this.isDelayedAtBorder) {
      if (Date.now() >= this.borderDelayEndTime) {
        this.isDelayedAtBorder = false; // Customs cleared
      } else {
        return; // Paused at border
      }
    }

    // 2. Adjust speed based on vehicle base speed and road speed limit
    const speedMultiplier = this.route.type.speedLimit / 80;
    const effectiveSpeed = this.type.baseSpeed * speedMultiplier;

    const previousProgress = this.progress;
    this.progress += effectiveSpeed * this.direction;

    // 3. Trigger Border Customs Delay at midpoint if crossing unlocked border
    if (this.route.borderGate && !this.route.borderGate.unlocked) {
      const crossedMidpoint = (previousProgress < 0.5 && this.progress >= 0.5) || 
                              (previousProgress > 0.5 && this.progress <= 0.5);
      if (crossedMidpoint) {
        this.isDelayedAtBorder = true;
        this.borderDelayEndTime = Date.now() + CONFIG.BORDER_CROSSING.DEFAULT_DELAY_MS;
        return;
      }
    }

    // 4. Handle Route Endpoint Arrivals
    if (this.progress >= 1) {
      this.progress = 1;
      this.handleArrival(this.route.endCity, this.route.startCity, onArrival, onCollectFare);
      this.direction = -1;
    } else if (this.progress <= 0) {
      this.progress = 0;
      this.handleArrival(this.route.startCity, this.route.endCity, onArrival, onCollectFare);
      this.direction = 1;
    }
  }

  /**
   * Offload passengers, collect payouts, and board waiting travelers
   */
  handleArrival(currentCity, nextTargetCity, onArrival, onCollectFare) {
    // Drop off passengers arriving at current city
    const remainingPassengers = [];
    for (const passenger of this.passengers) {
      if (passenger.destinationId === currentCity.id) {
        const fare = Math.round(this.route.distance * CONFIG.FARE_PER_KM);
        onCollectFare(fare);
      } else {
        // Intermediate transfer hub passenger
        currentCity.addPassenger(passenger);
      }
    }
    this.passengers = remainingPassengers;

    // Board waiting travelers heading toward next stop
    const spaceLeft = this.type.capacity - this.passengers.length;
    if (spaceLeft > 0) {
      const boarded = currentCity.boardPassengers(nextTargetCity.id, spaceLeft);
      this.passengers.push(...boarded);
    }
  }

  /**
   * Interpolate coordinates and render vehicle node
   */
  draw(ctx) {
    const currentX = this.route.startCity.x + (this.route.endCity.x - this.route.startCity.x) * this.progress;
    const currentY = this.route.startCity.y + (this.route.endCity.y - this.route.startCity.y) * this.progress;

    ctx.beginPath();
    ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
    ctx.fillStyle = this.isDelayedAtBorder ? '#ef4444' : this.type.color;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Passenger Payload Label
    if (this.passengers.length > 0) {
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.passengers.length, currentX, currentY);
    }
  }
}