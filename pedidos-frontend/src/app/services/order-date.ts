import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDate, OrderDateCreatePayload, OrderDateUpdatePayload } from '../shared/interfaces/order-date.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderDateService {
  private baseUrl = `${environment.apiUrl}/order-dates`;

  constructor(private http: HttpClient) {}

  private headers(): { headers: HttpHeaders } {
    const token = sessionStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // Listar todos (admin)
  getAll(): Observable<OrderDate[]> {
    return this.http.get<OrderDate[]>(this.baseUrl, this.headers());
  }

  // Obtener por id
  getById(id: number): Observable<OrderDate> {
    return this.http.get<OrderDate>(`${this.baseUrl}/${id}`, this.headers());
  }

  // Crear orderDate
  create(payload: OrderDateCreatePayload): Observable<OrderDate> {
    return this.http.post<OrderDate>(this.baseUrl, payload, this.headers());
  }

  // Actualizar orderDate
  update(id: number, payload: OrderDateUpdatePayload): Observable<OrderDate> {
    return this.http.put<OrderDate>(`${this.baseUrl}/${id}`, payload, this.headers());
  }

  // Eliminar orderDate
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.headers());
  }
}
