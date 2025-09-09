import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, tap, Observable, map } from 'rxjs';
import { OrderForm, OrderHistory, OrderDetail, OrderDateDetail } from '../shared/interfaces/order.interface'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class Order {
  private baseUrl = 'http://localhost:3000/api/orders'; // URL base de la API
  private orderSource = new BehaviorSubject<OrderForm[]>([]);
  orders$ = this.orderSource.asObservable();

  private baseUrlDates = 'http://localhost:3000/api/order-dates';
  private orderDetailSource = new BehaviorSubject<OrderDetail[]>([]);
  ordersDetail$ = this.orderDetailSource.asObservable();

  constructor(private http: HttpClient) { }

  // Obtener encabezados con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // Obtener el token del sessionStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Método para crear un pedido
  createOrder(payload: OrderForm): Observable<OrderForm> {
    return this.http.post<OrderForm>(this.baseUrl, payload, {
      headers: this.getHeaders(),
    });
  }

  editarPedido(orderId: number, payload: OrderForm): Observable<any> {
    const token = sessionStorage.getItem('token'); // Obtener el token de sesión
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.baseUrl}/${orderId}`, payload, { headers });
  }

  getOrders() {
    this.http.get<OrderForm[]>(this.baseUrl, { headers: this.getHeaders() }).pipe(
      tap(orders => this.orderSource.next(orders))
    ).subscribe();
  }

  getPendingOrders() {
    return this.http.get<OrderForm[]>(this.baseUrl, { headers: this.getHeaders() }).pipe(
      map(orders => orders.filter(o => o.status === 'pending'))
    );
  }

  getOrdersById(id: number): Observable<OrderForm> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<OrderForm>(url, { headers: this.getHeaders() });
  }

  getOrdersByUserAndMonth(userId: number, year: number, month: number, day: number): Observable<OrderHistory[]> {
    const token = sessionStorage.getItem('token'); // Obtén el token almacenado en el frontend
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
    });
    const url = `${this.baseUrl}/by-user-and-month?user_id=${userId}&year=${year}&month=${month}&day=${day}`;
    return this.http.get<OrderHistory[]>(url, { headers });
  }

  getOrderDetail(orderId: number): Observable<OrderDetail> {
    const token = sessionStorage.getItem('token'); // Obtén el token almacenado
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
    });

    const url = `${this.baseUrl}/${orderId}`;
    return this.http.get<OrderDetail>(url, { headers });
  }

  changeStatus(order: OrderDetail) {
    return this.http.put(`${this.baseUrl}/${order.order_id}`, order, { headers: this.getHeaders() }
    );
  }

  // Nuevo: obtener orders que tienen al menos un OrderDate con CR pendiente (admin)
  getOrdersWithPendingChangeRequests(year?: number, month?: number): Observable<OrderHistory[]> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? (now.getMonth() + 1);
    const monthStr = String(m).padStart(2, '0');

    const params = new HttpParams()
      .set('year', String(y))
      .set('month', monthStr);

    const url = `${this.baseUrl}/with-pending-change-requests`;
    return this.http.get<OrderHistory[]>(url, { headers, params });
  }


  getOrdersWithDates() {
    this.http.get<OrderDetail[]>(this.baseUrlDates, { headers: this.getHeaders() })
      .pipe(
        tap(orderDetails => this.orderDetailSource.next(orderDetails))
      )
      .subscribe();
  }



}
