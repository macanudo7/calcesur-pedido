import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { VehicleForm } from '../shared/interfaces/vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class Vehicle {

  private baseUrl = 'http://localhost:3000/api/type-vehicles';

  private vehiclesSource = new BehaviorSubject<VehicleForm[]>([]);
  vehicles$ = this.vehiclesSource.asObservable();

  constructor(private http: HttpClient) { }

  createVehicle(payload: VehicleForm) {
    return this.http.post(this.baseUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(() => this.getVehicles())
    );
  }

  getVehicles() {
    this.http.get<VehicleForm[]>(this.baseUrl).pipe(
      tap(vehicles => this.vehiclesSource.next(vehicles))
    ).subscribe();
  }

  deleteVehicle(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getVehicles())
    );
  }

  getVehicleById(id: number): Observable<VehicleForm> {
    return this.http.get<VehicleForm>(`${this.baseUrl}/${id}`);
  }

  updateVehicle(id: number, payload: VehicleForm) {
    return this.http.put(`${this.baseUrl}/${id}`, payload).pipe(
      tap(() => this.getVehicles())
    );
  }

}
