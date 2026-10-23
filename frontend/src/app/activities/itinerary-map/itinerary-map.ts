import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivityCardList } from '../activity-card-list/activity-card-list';
import { MapComponent } from '../map/map';
import { CreateUpdateActivity } from '../create-update-activity/create-update-activity';
import { Store } from '@ngrx/store';
import { ItineraryTabActions } from '../store/activities.actions';

@Component({
  imports: [ActivityCardList, CreateUpdateActivity, MapComponent],
  standalone: true,
  selector: 'app-itinerary-map',
  templateUrl: './itinerary-map.html',
})
export class ItineraryMap implements OnInit {
  private store = inject(Store);
  protected showCreate = signal(false);

  ngOnInit(): void {
    this.store.dispatch(ItineraryTabActions.opened());
  }

  openCreateModal(): void {
    this.showCreate.set(true);
  }

  closeCreateModal(): void {
    this.showCreate.set(false);
  }
}
