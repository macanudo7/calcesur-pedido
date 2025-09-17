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

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  
    login(credentials: loginDate): Observable < any > {
      return this.http.post(this.baseUrl, credentials).pipe(
        tap((response: any) => {
          if (response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('userName', credentials.identifier);
            sessionStorage.setItem('userId', response.user.user_id);
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
      sessionStorage.removeItem('userId');
      this.isAuthenticatedSubject.next(false);
    }

}
