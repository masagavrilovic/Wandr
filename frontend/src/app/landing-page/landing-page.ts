import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  standalone: true,
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
})
export class LandingPage {}
