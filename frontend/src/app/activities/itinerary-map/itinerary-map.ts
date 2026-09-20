import { Component, inject } from '@angular/core';
import { ActivityCardList } from '../activity-card-list/activity-card-list';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [ActivityCardList],
  standalone: true,
  selector: 'app-itinerary-map',
  templateUrl: './itinerary-map.html',
})
export class ItineraryMap {
  private route = inject(ActivatedRoute);
  protected tripId = Number(this.route.parent?.snapshot.paramMap.get('id'));
}
