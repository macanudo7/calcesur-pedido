import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://localhost:3000/api/auth/login';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  
    login(credentials: { identifier: string, password: string, userType: string }): Observable < any > {
      return this.http.post(this.baseUrl, credentials).pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', credentials.identifier);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
    }

    isAuthenticated(): Observable < boolean > {
      return this.isAuthenticatedSubject.asObservable();
    }

    logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      this.isAuthenticatedSubject.next(false);
    }

}
