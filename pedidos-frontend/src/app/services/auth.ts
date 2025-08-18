import { Injectable,} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { loginDate } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://localhost:3000/api/auth/login';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  
    login(credentials: loginDate): Observable < any > {
      return this.http.post(this.baseUrl, credentials).pipe(
        tap((response: any) => {
          if (response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('userName', credentials.identifier);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
    }

    isAuthenticated(): Observable < boolean > {
      return this.isAuthenticatedSubject.asObservable();
    }

    logout(): void {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userName');
      this.isAuthenticatedSubject.next(false);
    }

}
