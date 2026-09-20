import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { selectUserFullName, selectUserInitials } from '../../auth/store/auth.selectors';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html'
})
export class Topbar {
  private store = inject(Store);

  fullName = this.store.selectSignal(selectUserFullName);
  initials = this.store.selectSignal(selectUserInitials);
}
