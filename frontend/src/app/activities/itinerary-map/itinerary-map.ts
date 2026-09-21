import { Component, inject, signal } from '@angular/core';
import { ActivityCardList } from '../activity-card-list/activity-card-list';
import { ActivatedRoute } from '@angular/router';
import { CreateActivity } from '../create-activity/create-activity';

@Component({
  imports: [ActivityCardList, CreateActivity],
  standalone: true,
  selector: 'app-itinerary-map',
  templateUrl: './itinerary-map.html',
})
export class ItineraryMap {
  private route = inject(ActivatedRoute);
  protected tripId = Number(this.route.parent?.snapshot.paramMap.get('id'));
  protected showCreate = signal(false);

  openCreateModal() {
    this.showCreate.set(true);
  }
}
