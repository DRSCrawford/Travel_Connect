/**
 * Travel Connect - Routing Logic & Pathfinding
 */

export class Pathfinding {
  /**
   * Find path based on Passenger Preference (50% Shortest Distance vs 50% Fastest Time)
   */
  static findPath(startCityId, targetCityId, cities, routes, preferFastest = false) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();

    // Build Adjacency Graph from Active Routes
    const graph = {};
    Object.keys(cities).forEach(id => {
      graph[id] = [];
      distances[id] = Infinity;
      previous[id] = null;
      unvisited.add(id);
    });

    distances[startCityId] = 0;

    routes.forEach(route => {
      const weight = preferFastest ? route.getTravelTime() : route.distance;
      graph[route.startCity.id].push({ node: route.endCity.id, weight });
      graph[route.endCity.id].push({ node: route.startCity.id, weight });
    });

    while (unvisited.size > 0) {
      // Pick unvisited node with smallest distance
      let current = null;
      for (const node of unvisited) {
        if (current === null || distances[node] < distances[current]) {
          current = node;
        }
      }

      if (current === null || distances[current] === Infinity) break;
      if (current === targetCityId) break;

      unvisited.delete(current);

      for (const neighbor of graph[current]) {
        if (unvisited.has(neighbor.node)) {
          const alt = distances[current] + neighbor.weight;
          if (alt < distances[neighbor.node]) {
            distances[neighbor.node] = alt;
            previous[neighbor.node] = current;
          }
        }
      }
    }

    // Reconstruct Route Path Array
    const path = [];
    let curr = targetCityId;
    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }

    // Return valid path (excluding start node) or empty array if unreachable
    return path.length > 1 && path[0] === startCityId ? path.slice(1) : [];
  }
}