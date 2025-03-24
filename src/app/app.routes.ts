import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./feature/products/products.component').then(
            (m) => m.ProductsComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'sign-in' },
];
