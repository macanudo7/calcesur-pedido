import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import { OrderForm, OrderHistory,OrderDetail } from '../shared/interfaces/order.interface'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class Order {
  private baseUrl = 'http://localhost:3000/api/orders'; // URL base de la API
  private orderSource = new BehaviorSubject<OrderForm[]>([]);
  orders$ = this.orderSource.asObservable();



  constructor(private http: HttpClient) {}

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

  
 

  
}
