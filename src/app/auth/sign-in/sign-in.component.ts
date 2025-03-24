import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { MaterialModule } from '../../material.module';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, ProgressSpinnerComponent, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  //dependancies
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  alertService = inject(AlertService);

  //variables
  signInForm!: FormGroup;
  hidePassword = signal<boolean>(true);
  showPasswordField = false;
  isAuthenticating = signal<boolean>(false);
  authenticationMessage = signal<string>('');

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_-]+$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
        ],
      ],
    });
  }

    continue() {
      const usernameControl = this.signInForm.get('username');
      if (usernameControl?.valid) {
        this.showPasswordField = true;
      } else {
        usernameControl?.markAsTouched();
      }
    }

  authenticate() {
    if (this.signInForm.valid) {
      this.isAuthenticating.set(true);
      this.authenticationMessage.set('Authenticating... Please wait');

      const formVal = this.signInForm.value;
      const payload = {
        username: formVal.username,
        password: formVal.password,
      };
      this.authService.login(payload).subscribe({
        next: (user) => {
          if (user) {
            this.isAuthenticating.set(false);
            this.alertService.success(
              `Login successful: Welcome ${user.firstName}`
            );
            this.router.navigate(['/app/products']);
          } else {
            this.isAuthenticating.set(false);
            this.authenticationMessage.set('');
            this.alertService.error(`Invalid credentials`);
          }
        },
        error: (err) => {
          this.isAuthenticating.set(false);
          this.authenticationMessage.set('');
          console.error('Login failed:', err);
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
