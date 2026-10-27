import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedTrip, selectSelectedTripMembers } from '../../store/trips.selectors';
import { AsyncPipe } from '@angular/common';
import { map, take } from 'rxjs';

@Component({
  imports: [AsyncPipe],
  selector: 'app-members-tab',
  templateUrl: './members-tab.html',
})
export class MembersTab implements OnInit {
  private store = inject(Store);
  inviteCode: string = '';
  members$ = this.store.select(selectSelectedTripMembers);

  protected copied = signal(false);

  ngOnInit(): void {
    this.store.select(selectSelectedTrip).pipe(
      take(1),
      map(trip => trip?.inviteCode)
    ).subscribe(code => code ? this.inviteCode = code : '');
  }

  copyInviteCode(): void {
    navigator.clipboard.writeText(this.inviteCode).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
