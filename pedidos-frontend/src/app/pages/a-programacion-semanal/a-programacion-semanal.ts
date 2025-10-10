import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { OrderForm } from '../../shared/interfaces/order.interface';
import { Observable } from 'rxjs';
import { Order } from '../../services/order';
import { DatePipe, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { Vehicle } from '../../services/vehicle';
import { VehicleForm } from '../../shared/interfaces/vehicle.interface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-a-programacion-semanal',
  imports: [DatePipe, NgFor, NgIf, AsyncPipe],
  templateUrl: './a-programacion-semanal.html',
  styleUrl: './a-programacion-semanal.scss',
  standalone: true,
})
export class AProgramacionSemanal implements OnInit {

  nameOfUser: string | null = null;
  orders$: Observable<OrderForm[]>;
  vehicles$: Observable<VehicleForm[]>;

  allVehicles = signal<VehicleForm[]>([]);
  // fechas: string[] = [];
  fechas = signal<string[]>([]);

  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  fechasFiltradas = computed(() => {
    const start = this.fechaInicio();
    const end = this.fechaFin();
    const todas = this.fechas();

    if (!start && !end) return todas;

    return todas.filter(f =>
      (!start || f >= start) &&
      (!end || f <= end)
    );
  });

  constructor(
    private orderService: Order,
    private cd: ChangeDetectorRef,
    private vehicleService: Vehicle
  ) {
    this.orders$ = this.orderService.orders$;
    this.vehicles$ = this.vehicleService.vehicles$;
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.nameOfUser = sessionStorage.getItem('userName');
    }

    this.orderService.getOrders();

    this.orders$.subscribe(orders => {
      const todasFechas = orders.flatMap(o =>
        o.orderDates.map(d => d.delivery_date.split('T')[0])
      );
      // this.fechas = Array.from(new Set(todasFechas))
      //   .sort((a, b) => a.localeCompare(b));
      this.fechas.set(
        Array.from(new Set(todasFechas)).sort((a, b) => a.localeCompare(b))
      );
    });

    this.vehicleService.getVehicles();

    this.vehicles$.subscribe(vehicles => {
      this.allVehicles.set(vehicles);
    });
  }

  // Obtener cantidad para una fecha específica
  getCantidadPorFecha(order: OrderForm, fecha: string): number {
    const dateDetail = order.orderDates.find(
      d => d.delivery_date.split('T')[0] === fecha
    );
    return dateDetail ? dateDetail.quantity : 0;
  }

  // Total de un pedido
  getTotalOrder(order: OrderForm): number {
    const fechas = this.fechasFiltradas();
    return fechas.reduce((sum, f) => sum + this.getCantidadPorFecha(order, f), 0);
    // return order.orderDates.reduce((sum, d) => sum + (d.quantity || 0), 0);
  }

  // Total por fecha
  getTotalPorFecha(orders: OrderForm[], fecha: string): number {
    return orders.reduce((sum, o) => sum + this.getCantidadPorFecha(o, fecha), 0);
  }

  // Total general
  getTotalGeneral(orders: OrderForm[]): number {
    return orders.reduce((sum, o) => sum + this.getTotalOrder(o), 0);
  }


  getVehicleNameById(vehicleId?: number): string {
    if (!vehicleId) return 'Desconocido';
    const vehicle = this.allVehicles().find(v => v.type_vehicle_id === vehicleId);
    return vehicle ? vehicle.name : 'Desconocido';
  }

  descargarExcel() {
    // Tomamos la tabla directamente del DOM
    const element = document.querySelector('.main-table table') as HTMLElement;
    if (!element) return;

    // Convertir la tabla HTML a una hoja Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Crear un libro de Excel y agregar la hoja
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');

    // Exportar el archivo Excel
    const nombreArchivo = `programacion-pedidos-${new Date().toISOString().slice(0,10)}.xlsx`;
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Guardar archivo
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, nombreArchivo);
  }


  descargarTabla() {
    console.log(':)')
  }

}
