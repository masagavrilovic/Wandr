import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Activity } from '../activities.models';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  imports: [DatePipe, SlicePipe],
  standalone: true,
  selector: 'app-activity-card',
  templateUrl: './activity-card.html',
})
export class ActivityCard {
  @Input({ required: true }) activity!: Activity;
}
