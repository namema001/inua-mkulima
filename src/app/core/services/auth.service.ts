import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AuthRequest, User } from '../interfaces/auth.model';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.authApiUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private alertService: AlertService) {}

  login(authData: AuthRequest): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, authData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response) => {
          this.storeToken(response.accessToken);
          this.setUser(response); 
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }

  getToken(): string | null {
    const encodedToken = localStorage.getItem('accessToken');
    return encodedToken ? atob(encodedToken) : null;
  }

  private storeToken(token: string): void {
    const encodedToken = btoa(token);
    localStorage.setItem('accessToken', encodedToken);
  }

  private setUser(user: User): void {
    this.userSubject.next(user);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Invalid credentials provided.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have access.';
          break;
        case 404:
          errorMessage = 'Not Found. The requested resource was not found.';
          break;
        default:
          errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
          break;
      }
    }
    this.alertService.showAlert(errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }
}
