import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { UserForm } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class User {

  private baseUrl = 'http://localhost:3000/api/users';

  private usersSource = new BehaviorSubject<UserForm[]>([]);
  users$ = this.usersSource.asObservable();

  constructor(private http: HttpClient) { }

   // ================== Auth Token
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createUser(payload: UserForm) {
    return this.http.post(this.baseUrl, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.getUsers())
    );
  }

  getUsers() {
    this.http.get<UserForm[]>(this.baseUrl, { headers: this.getHeaders() }).pipe(
      tap(users => this.usersSource.next(users))
    ).subscribe();
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.getUsers())
    );
  }

  getUserById(id: number): Observable<UserForm> {
    return this.http.get<UserForm>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateUser(id: number, payload: UserForm) {
    return this.http.put(`${this.baseUrl}/${id}`, payload, { headers: this.getHeaders() }).pipe(
      tap(() => this.getUsers())
    );
  }
}
