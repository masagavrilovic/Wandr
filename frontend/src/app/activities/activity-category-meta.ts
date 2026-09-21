import { ActivityCategory } from "./activities.models";

export interface CategoryMeta {
  icon: string;
  color: string;
}

export const ACTIVITY_CATEGORY_META: Record<ActivityCategory, CategoryMeta> = {
  [ActivityCategory.RESTAURANT]: { icon: 'restaurant', color: '#C85A32' },
  [ActivityCategory.CAFE]: { icon: 'local_cafe', color: '#C85A32' },
  [ActivityCategory.BAR_NIGHTLIFE]: { icon: 'local_bar', color: '#C85A32' },
  [ActivityCategory.STREET_FOOD]: { icon: 'fastfood', color: '#C85A32' },
  [ActivityCategory.GASTRONOMY_EXPERIENCE]: { icon: 'restaurant_menu', color: '#C85A32' },

  [ActivityCategory.MUSEUM]: { icon: 'museum', color: '#8E24AA' },
  [ActivityCategory.HISTORICAL_SITE]: { icon: 'castle', color: '#8E24AA' },
  [ActivityCategory.RELIGIOUS_SITE]: { icon: 'church', color: '#8E24AA' },

  [ActivityCategory.VIEWPOINT]: { icon: 'landscape', color: '#708238' },
  [ActivityCategory.PARK_GARDEN]: { icon: 'park', color: '#708238' },
  [ActivityCategory.BEACH]: { icon: 'beach_access', color: '#708238' },
  [ActivityCategory.NATURE_RESERVE]: { icon: 'forest', color: '#708238' },
  [ActivityCategory.HIKING]: { icon: 'hiking', color: '#708238' },

  [ActivityCategory.CONCERT_SHOW]: { icon: 'theater_comedy', color: '#CE2D4F' },
  [ActivityCategory.AMUSEMENT_PARK]: { icon: 'attractions', color: '#CE2D4F' },
  [ActivityCategory.EVENT_FESTIVAL]: { icon: 'festival', color: '#CE2D4F' },

  [ActivityCategory.GUIDED_TOUR]: { icon: 'tour', color: '#30B2A9' },
  [ActivityCategory.DAY_TRIP]: { icon: 'travel_explore', color: '#30B2A9' },
  [ActivityCategory.WATER_ACTIVITY]: { icon: 'kayaking', color: '#30B2A9' },
  [ActivityCategory.WORKSHOP_CLASS]: { icon: 'school', color: '#30B2A9' },

  [ActivityCategory.SHOPPING]: { icon: 'shopping_bag', color: '#F4C430' },
  [ActivityCategory.LOCAL_MARKET]: { icon: 'storefront', color: '#F4C430' },

  [ActivityCategory.ACCOMMODATION]: { icon: 'hotel', color: '#005B94' },
  [ActivityCategory.WELLNESS_SPA]: { icon: 'spa', color: '#005B94' },
  [ActivityCategory.TRANSPORT]: { icon: 'directions_transit', color: '#005B94' },
  [ActivityCategory.CAR_RENTAL]: { icon: 'car_rental', color: '#005B94' },
  
  [ActivityCategory.OTHER]: { icon: 'place', color: '#838380' },
};

export function getCategoryMeta(category: string): CategoryMeta {
  return ACTIVITY_CATEGORY_META[category as ActivityCategory]
}