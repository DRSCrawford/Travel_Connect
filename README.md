# Travel Connect 🌍🚌

**Travel Connect** is a web-based, land-based transport network simulation game set across the African continent. Inspired by minimalist transit strategy games, players manage passenger transport hubs, construct road networks, handle border customs queues, and upgrade highway infrastructure to keep passenger traffic flowing smoothly.

---

## 🎮 Key Features

* **African Continent Map:** Start in South Africa and strategically expand your transit network northwards through neighboring countries.
* **Interactive Route Building:** Click to connect city terminals and deploy transport vehicles.
* **Dynamic Road Lane Tiers:** Upgrade routes from basic gravel tracks (60 km/h) up to multi-lane highways (120 km/h) to handle heavier traffic volume and increase speed limits.
* **Multi-Hop Passenger Transfers:** Travelers automatically navigate intermediate hub terminals using Dijkstra-based pathfinding (choosing between shortest distance vs. fastest highway route).
* **Border Customs & Delays:** Crossing international borders introduces customs checkpoint processing delays.
* **Overcrowding Terminal Penalties:** If airport/bus terminals remain overcrowded past their warning timer, cash penalties are incurred per second.

---

## 🛠️ Tech Stack

* **Frontend Engine:** Native HTML5 Canvas + Vanilla JavaScript (ES6 Modules)
* **Styling:** CSS3 (Modern Slate Dark Theme with Backdrop Blurs)
* **Hosting:** GitHub Pages

---

## 📂 Project Structure

```text
Travel_Connect/
├── index.html          # Main HTML layout & HUD display
├── styles.css          # UI styling & overlay cards
└── src/
    ├── main.js         # Core GameEngine orchestrator & render loop
    ├── config.js       # Game constants, vehicle specs & road tier data
    ├── map.js          # African country border polygons & city coordinates
    ├── City.js         # Terminal queues, passenger boarding & overcrowding logic
    ├── Route.js        # Road lane properties, distance & border checkpoint logic
    ├── Vehicle.js      # Vehicle physics, movement interpolation & payout collection
    └── Pathfinding.js  # Dijkstra pathfinding algorithm for transfer passengers
