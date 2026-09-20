import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { selectUserFullName, selectUserInitials } from '../../auth/store/auth.selectors';
import { AuthActions } from '../../auth/store/auth.actions';

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
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(state => !state);
  }

  logout() {
    this.isMenuOpen.set(false);
    this.store.dispatch(AuthActions.logout());
  }
}
