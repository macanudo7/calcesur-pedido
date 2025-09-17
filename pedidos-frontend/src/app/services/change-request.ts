import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import {
  ChangeRequest,
  CreateChangeRequestPayload,
  UpdateChangeRequestPayload,
  ChangeRequestsQueryPayload,
  ChangeRequestsQueryResponse
} from '../shared/interfaces/change-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {
  private baseUrl = `${environment.apiUrl}/change-requests`;
  private source = new BehaviorSubject<ChangeRequest[]>([]);
  changeRequests$ = this.source.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Crear nueva solicitud
  createChangeRequest(payload: CreateChangeRequestPayload): Observable<ChangeRequest> {
    return this.http.post<ChangeRequest>(this.baseUrl, payload, { headers: this.getHeaders() });
  }

  // Listar todas (admin) y actualizar el observable interno
  getChangeRequests(): void {
    this.http.get<ChangeRequest[]>(this.baseUrl, { headers: this.getHeaders() }).pipe(
      tap(list => this.source.next(list))
    ).subscribe({
      error: (err) => console.error('Error al listar change requests:', err)
    });
  }

  // Obtener CRs de un order_date concreto (nuevo endpoint)
  getByOrderDate(orderDateId: number): Observable<ChangeRequest[]> {
    return this.http.get<ChangeRequest[]>(
      `http://localhost:3000/api/order-dates/${orderDateId}/change-requests`,
      { headers: this.getHeaders() }
    );
  }

  // Query batch: obtener CRs por varios order_date_id (nuevo endpoint)
  queryChangeRequests(payload: ChangeRequestsQueryPayload): Observable<ChangeRequestsQueryResponse> {
    return this.http.post<ChangeRequestsQueryResponse>(
      `${this.baseUrl}/query`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  // Helper: obtener sólo la última CR por cada order_date_id (map del response)
  getLatestByOrderDates(orderDateIds: number[]): Observable<Record<number, ChangeRequest | null>> {
    const payload: ChangeRequestsQueryPayload = { order_date_ids: orderDateIds, limit_per_order_date: 1 };
    return this.queryChangeRequests(payload).pipe(
      map((resp: ChangeRequestsQueryResponse) => {
        const result: Record<number, ChangeRequest | null> = {};
        for (const idStr of Object.keys(resp.byOrderDate || {})) {
          const id = Number(idStr);
          const arr = resp.byOrderDate[idStr]; // idStr es string — OK según la interfaz
          result[id] = (arr && arr.length) ? arr[0] : null;
        }
        // asegurar que todos los pedidos solicitados aparecen (null si no hay CR)
        for (const id of orderDateIds) {
          if (!(id in result)) result[id] = null;
        }
        return result;
      })
    );
  }

  // Obtener por id (admin)
  getChangeRequestById(requestId: number): Observable<ChangeRequest> {
    return this.http.get<ChangeRequest>(`${this.baseUrl}/${requestId}`, { headers: this.getHeaders() });
  }

  // Actualizar / responder (admin)
  updateChangeRequest(requestId: number, payload: UpdateChangeRequestPayload): Observable<ChangeRequest> {
    return this.http.put<ChangeRequest>(`${this.baseUrl}/${requestId}`, payload, { headers: this.getHeaders() }).pipe(
      tap(() => this.getChangeRequests()) // refresca la lista después de la actualización
    );
  }
}
