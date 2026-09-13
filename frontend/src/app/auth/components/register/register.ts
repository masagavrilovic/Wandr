import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
})
export class Register {
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit()
  {
    if (this.registerForm.invalid || this.isSubmitting()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const { firstName, lastName, email, password } = this.registerForm.getRawValue();

    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.authService.login({ email, password }).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.router.navigate(['/']);
          },
          error: () => {
            this.isSubmitting.set(false);
            this.router.navigate(['/login']);
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (err.status === 409) this.errorMessage.set('This email is already registered');
        else if (err.status === 400) this.errorMessage.set('Please check your input and try again');
        else this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }
}
