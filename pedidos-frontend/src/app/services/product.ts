import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoForm } from '../shared/interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class Product {

  private baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  createProduct(payload: ProductoForm) {
    return this.http.post(this.baseUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
