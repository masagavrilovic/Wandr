import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFullName, selectInitials } from '../../../users/store/users.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.html'
})
export class Topbar {
  private store = inject(Store);

  fullName = toSignal(this.store.select(selectFullName), { initialValue: '' });
  initials = toSignal(this.store.select(selectInitials), { initialValue: '' });
}
