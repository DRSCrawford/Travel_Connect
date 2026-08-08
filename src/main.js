/**
 * Travel Connect - Main Application & Game Loop
 */

import { CONFIG } from './config.js';
import { COUNTRIES, CITIES, BORDER_GATES } from './map.js';
import { City } from './City.js';
import { Route } from './Route.js';
import { Vehicle } from './Vehicle.js';
import { Pathfinding } from './Pathfinding.js';

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // State Variables
    this.money = CONFIG.STARTING_MONEY;
    this.cities = {};
    this.routes = [];
    this.vehicles = [];
    this.unlockedCountries = new Set([CONFIG.STARTING_COUNTRY]);
    
    this.selectedCity = null;

    // DOM Elements
    this.moneyEl = document.getElementById('money');
    this.countryCountEl = document.getElementById('country-count');
    this.routeCountEl = document.getElementById('route-count');
    this.vehicleCountEl = document.getElementById('vehicle-count');
    this.penaltyRateEl = document.getElementById('penalty-rate');

    this.init();
  }

  init() {
    // Instantiate City instances
    Object.values(CITIES).forEach(data => {
      this.cities[data.id] = new City(data);
    });

    // Event Listeners
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    
    // Spawners & Loops
    setInterval(() => this.spawnPassengers(), 1200);
    setInterval(() => this.applyOvercrowdPenalties(), 1000);

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  spawnPassengers() {
    const cityKeys = Object.keys(this.cities);
    const originKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
    let destKey = originKey;
    while (destKey === originKey) {
      destKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
    }

    const origin = this.cities[originKey];
    if (origin && this.unlockedCountries.has(origin.country)) {
      // 50% Choice: Shortest distance vs Fastest highway time
      const preferFastest = Math.random() < 0.5;
      const path = Pathfinding.findPath(originKey, destKey, this.cities, this.routes, preferFastest);

      origin.addPassenger({
        destinationId: destKey,
        path: path
      });
    }
  }

  handleCanvasClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Detect Clicked City
    let clickedCity = null;
    for (const city of Object.values(this.cities)) {
      if (Math.hypot(city.x - clickX, city.y - clickY) <= 25) {
        clickedCity = city;
        break;
      }
    }

    if (clickedCity) {
      if (!this.selectedCity) {
        this.selectedCity = clickedCity;
      } else if (this.selectedCity.id === clickedCity.id) {
        this.selectedCity = null;
      } else {
        this.buildRoute(this.selectedCity, clickedCity);
        this.selectedCity = null;
      }
    } else {
      this.selectedCity = null;
    }
  }

  buildRoute(cityA, cityB) {
    const buildCost = CONFIG.ROAD_TYPES.GRAVEL.buildCost;

    if (this.money < buildCost) {
      alert(`Not enough funds! Need $${buildCost} to build a Gravel Road.`);
      return;
    }

    // Check if route exists
    const exists = this.routes.some(r => 
      (r.startCity.id === cityA.id && r.endCity.id === cityB.id) ||
      (r.startCity.id === cityB.id && r.endCity.id === cityA.id)
    );

    if (exists) return;

    // Check country border gate
    let borderGate = null;
    if (cityA.country !== cityB.country) {
      borderGate = BORDER_GATES.find(g => 
        (g.countryA === cityA.country && g.countryB === cityB.country) ||
        (g.countryA === cityB.country && g.countryB === cityA.country)
      );
    }

    this.money -= buildCost;
    const newRoute = new Route(cityA, cityB, 'GRAVEL', borderGate);
    this.routes.push(newRoute);

    // Auto-assign first Minibus Taxi
    const newVehicle = new Vehicle(Date.now(), 'MINIBUS', newRoute);
    this.vehicles.push(newVehicle);
    newRoute.assignedVehicles.push(newVehicle);

    this.updateHUD();
  }

  applyOvercrowdPenalties() {
    let totalPenalty = 0;
    Object.values(this.cities).forEach(city => {
      totalPenalty += city.getPenaltyRate();
    });

    if (totalPenalty > 0) {
      this.money = Math.max(0, this.money - totalPenalty);
      this.penaltyRateEl.textContent = `-$${totalPenalty}/s`;
      this.updateHUD();
    } else {
      this.penaltyRateEl.textContent = `-$0/s`;
    }
  }

  updateHUD() {
    this.moneyEl.textContent = `$${this.money.toLocaleString()}`;
    this.countryCountEl.textContent = this.unlockedCountries.size;
    this.routeCountEl.textContent = this.routes.length;
    this.vehicleCountEl.textContent = this.vehicles.length;
  }

  update() {
    this.vehicles.forEach(vehicle => {
      vehicle.update(
        16,
        (city) => {},
        (fare) => {
          this.money += fare;
          this.updateHUD();
        }
      );
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Country Borders
    Object.values(COUNTRIES).forEach(country => {
      const isUnlocked = this.unlockedCountries.has(country.id);
      this.ctx.beginPath();
      country.polygon.forEach((pt, i) => {
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.closePath();
      this.ctx.fillStyle = isUnlocked ? country.color : 'rgba(15, 23, 42, 0.6)';
      this.ctx.strokeStyle = isUnlocked ? country.stroke : '#334155';
      this.ctx.lineWidth = 2;
      this.ctx.fill();
      this.ctx.stroke();
    });

    // 2. Draw Routes
    this.routes.forEach(route => route.draw(this.ctx));

    // 3. Draw Cities
    Object.values(this.cities).forEach(city => {
      const isSelected = this.selectedCity && this.selectedCity.id === city.id;
      const isUnlocked = this.unlockedCountries.has(city.country);
      city.draw(this.ctx, isSelected, isUnlocked);
    });

    // 4. Draw Vehicles
    this.vehicles.forEach(vehicle => vehicle.draw(this.ctx));
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start Game Engine when DOM renders
window.addEventListener('DOMContentLoaded', () => {
  new GameEngine();
});