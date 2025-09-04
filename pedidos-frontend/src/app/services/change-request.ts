import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { ChangeRequest, CreateChangeRequestPayload, UpdateChangeRequestPayload } from '../shared/interfaces/change-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {
  private baseUrl = 'http://localhost:3000/api/change-requests';
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
