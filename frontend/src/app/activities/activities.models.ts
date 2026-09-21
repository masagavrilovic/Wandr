export interface Activity {
  id: number;
  name: string;
  date?: string | null;
  time?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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
  notes?: string | null;
}