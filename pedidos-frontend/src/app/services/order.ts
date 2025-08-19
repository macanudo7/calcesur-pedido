import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import { OrderForm } from '../shared/interfaces/order.interface'; // Asegúrate de que la ruta sea correcta

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

  


  
}
