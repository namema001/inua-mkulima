import { Component, HostListener, inject, signal } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  firstName: string = 'JOHN';
  authService = inject(AuthService);
  alertService = inject(AlertService);
  router = inject(Router);
  isMobileView = signal<boolean>(window.innerWidth <= 768);

  isMobile(): boolean {
    return this.isMobileView();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileView.set(window.innerWidth <= 768);
  }

  logout() {
    this.authService.logout();
    this.alertService.success(`You have successfully logged out.`);
    this.router.navigate(['/']);
  }
}
