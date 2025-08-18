import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { ProductoForm } from '../shared/interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class Product {

  private baseUrl = 'http://localhost:3000/api/products';

  private productsSource = new BehaviorSubject<ProductoForm[]>([]);
  products$ = this.productsSource.asObservable();

  constructor(private http: HttpClient) { }

  // ================== Auth Token
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createProduct(payload: ProductoForm) {
    return this.http.post(this.baseUrl, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.getProducts())
    );
  }

  getProducts() {
    this.http.get<ProductoForm[]>(this.baseUrl).pipe(
      tap(products => this.productsSource.next(products))
    ).subscribe();
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.getProducts())
    );
  }

  getProductById(id: number): Observable<ProductoForm> {
    return this.http.get<ProductoForm>(`${this.baseUrl}/${id}`);
  }

  updateProduct(id: number, payload: ProductoForm) {
    return this.http.put(`${this.baseUrl}/${id}`, payload, { headers: this.getHeaders() }).pipe(
      tap(() => this.getProducts())
    );
  }




}
