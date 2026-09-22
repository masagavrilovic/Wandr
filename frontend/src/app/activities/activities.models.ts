export enum ActivityCategory {
  RESTAURANT = 'Restaurant',
  CAFE = 'Cafe',
  BAR_NIGHTLIFE = 'Bar & Nightlife',
  STREET_FOOD = 'Street Food',
  GASTRONOMY_EXPERIENCE = 'Gastronomy Experience',
  MUSEUM = 'Museum',
  HISTORICAL_SITE = 'Historical Site',
  RELIGIOUS_SITE = 'Religious Site',
  VIEWPOINT = 'Viewpoint',
  PARK_GARDEN = 'Park & Garden',
  BEACH = 'Beach',
  NATURE_RESERVE = 'Nature Reserve',
  HIKING = 'Hiking',
  CONCERT_SHOW = 'Concert & Show',
  AMUSEMENT_PARK = 'Amusement Park',
  EVENT_FESTIVAL = 'Event & Festival',
  GUIDED_TOUR = 'Guided Tour',
  DAY_TRIP = 'Day Trip',
  WATER_ACTIVITY = 'Water Activity',
  WORKSHOP_CLASS = 'Workshop & Class',
  SHOPPING = 'Shopping',
  LOCAL_MARKET = 'Local Market',
  ACCOMMODATION = 'Accommodation',
  WELLNESS_SPA = 'Wellness & Spa',
  TRANSPORT = 'Transport',
  CAR_RENTAL = 'Car Rental',
  OTHER = 'Other',
}

export interface Activity {
  id: number;
  name: string;
  date?: string | null;
  time?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  category: ActivityCategory;
  notes?: string | null;
}

export interface ActivityGroup {
  date: string | null;
  activities: Activity[];
}

export interface CreateActivityPayload {
  name: string;
  date?: string | null;
  time?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  category?: ActivityCategory;
  notes?: string | null;
}

export interface UpdateActivityPayload {
  name?: string | null;
  date?: string | null;
  time?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  category?: ActivityCategory;
  notes?: string | null;
}