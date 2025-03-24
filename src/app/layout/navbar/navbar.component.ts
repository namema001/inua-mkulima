import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../core/interfaces/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
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

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.alertService.success(`You have successfully logged out.`);
    this.router.navigate(['/']);
  }
}
