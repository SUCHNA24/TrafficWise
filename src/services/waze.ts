/**
 * Represents routing information, including travel time and route geometry.
 */
export interface Route {
  /**
   * The estimated travel time in minutes.
   */
  travelTimeMinutes: number;
  /**
   * A GeoJSON geometry representing the route.
   */
  routeGeometry: string;
}

/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Asynchronously retrieves routing information from Waze between two locations.
 *
 * @param start The starting location.
 * @param end The destination location.
 * @returns A promise that resolves to a Route object containing travel time and route geometry.
 */
export async function getRoute(start: Location, end: Location): Promise<Route> {
  // TODO: Implement this by calling the Waze API.
  return {
    travelTimeMinutes: 15,
    routeGeometry: 'LINESTRING(-122.4194 37.7749,-122.4194 37.7749)',
  };
}
