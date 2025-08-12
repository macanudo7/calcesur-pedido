import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  createUser(payload: UserForm) {
    return this.http.post(this.baseUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(() => this.getUsers())
    );
  }

  getUsers() {
    this.http.get<UserForm[]>(this.baseUrl).pipe(
      tap(users => this.usersSource.next(users))
    ).subscribe();
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getUsers())
    );
  }

  getUserById(id: number): Observable<UserForm> {
    return this.http.get<UserForm>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, payload: UserForm) {
    return this.http.put(`${this.baseUrl}/${id}`, payload).pipe(
      tap(() => this.getUsers())
    );
  }
}
