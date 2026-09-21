export interface GeoSuggestion {
  name?: string;
  street?: string;
  city?: string;
  country?: string;
  postcode?: string;
  displayName: string;
  longitude: number;
  latitude: number;
}

export interface LocationResult {
  displayName: string;
  latitude: number;
  longitude: number;
}