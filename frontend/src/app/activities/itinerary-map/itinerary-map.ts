import { Component, inject, signal } from '@angular/core';
import { ActivityCardList } from '../activity-card-list/activity-card-list';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from '../map/map';
import { CreateUpdateActivity } from '../create-update-activity/create-update-activity';

@Component({
  imports: [ActivityCardList, CreateUpdateActivity, MapComponent],
  standalone: true,
  selector: 'app-itinerary-map',
  templateUrl: './itinerary-map.html',
})
export class ItineraryMap {
  private route = inject(ActivatedRoute);
  protected tripId = Number(this.route.parent?.snapshot.paramMap.get('id'));
  protected showCreate = signal(false);

  openCreateModal(): void {
    this.showCreate.set(true);
  }

  closeCreateModal(): void {
    this.showCreate.set(false);
  }
}
