import { Injectable,} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { loginDate } from '../shared/interfaces/user.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = `${environment.apiUrl}/auth/login`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
  }

  /** Verifica si hay token en sessionStorage */
  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }
  
    login(credentials: loginDate): Observable < any > {
      return this.http.post(this.baseUrl, credentials).pipe(
        tap((response: any) => {
          if (response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('userName', credentials.identifier);
            sessionStorage.setItem('userId', response.user.user_id);

            if (response.user.userType) {
              sessionStorage.setItem('userType', response.user.userType);
            }

            this.isAuthenticatedSubject.next(true);
          }
        })
      );
    }

    isAuthenticated(): Observable < boolean > {
      return this.isAuthenticatedSubject.asObservable();
    }

      /** Método directo para los guards */
    isLoggedIn(): boolean {
      return this.hasToken();
    }

    /** Obtiene el rol actual */
    getRole(): string | null {
      return sessionStorage.getItem('userType');
    }

    isAdmin(): boolean {
      return sessionStorage.getItem('role') === 'admin';
    }

    logout(): void {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userType');
      this.isAuthenticatedSubject.next(false);
    }

}
