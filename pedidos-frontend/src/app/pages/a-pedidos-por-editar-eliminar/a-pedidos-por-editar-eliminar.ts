import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../../shared/interfaces/order.interface';
import { Order } from '../../services/order';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../services/vehicle';
import { VehicleForm } from '../../shared/interfaces/vehicle.interface';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-a-pedidos-por-editar-eliminar',
  imports: [CommonModule, FormsModule],
  templateUrl: './a-pedidos-por-editar-eliminar.html',
  styleUrl: './a-pedidos-por-editar-eliminar.scss',
  standalone: true,
})
export class APedidosPorEditarEliminar implements OnInit{

  nameOfUser: string | null = null;

  vehicles$: Observable<VehicleForm[]>;

  searchTerm = signal('');
  selectedUserType = signal('');
  allOrders = signal<OrderHistory[]>([]);
  allVehicles = signal<VehicleForm[]>([]);

  userTypes: string[] = [];

  cumplimiento: number;
  cronograma: number;
  today: Date = new Date(); // <- añadir

  baseMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  currentMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  canGoPrev = computed(() => {
    const cur = this.currentMonth();
    const limit = new Date(this.baseMonth.getFullYear(), this.baseMonth.getMonth() - 1, 1);
    return cur > limit;
  });

  canGoNext = computed(() => {
    const cur = this.currentMonth();
    const limit = new Date(this.baseMonth.getFullYear(), this.baseMonth.getMonth() + 1, 1);
    return cur < limit;
  });


  displayMonth = computed(() => {
    const d = this.currentMonth();

    return d.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  });

  pendingOrders = computed(() =>
    this.allOrders().filter(order => order.status === 'confirmed-elimination')
  );

  constructor(
    private router: Router,
    private orderService: Order,
    private cd: ChangeDetectorRef,
    private vehicleService: Vehicle
  ) {
    this.vehicles$ = this.vehicleService.vehicles$;

    this.cumplimiento = 0;
    this.cronograma = 0;

    registerLocaleData(localeEs, 'es');
  }


  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.nameOfUser = sessionStorage.getItem('userName');
    }

    // Usar la nueva API que filtra por mes/año (usa valores por defecto si no pasas params)
    this.orderService.getOrdersWithPendingChangeRequests().subscribe({
      next: (orders) => {
        this.allOrders.set(orders as OrderHistory[]);
        console.log('Orders with pending CRs loaded:', orders);
        this.userTypes = Array.from(
          new Set(
            orders
              .map(o => o.product?.name)
              .filter((name): name is string => !!name)
          )
        );
      },
      error: (err) => {
        console.error('Error fetching pending orders:', err);
        // fallback: intentar cargar todos los pedidos y luego asignar a allOrders
        // (llamamos a getOrders() para que el servicio intente poblar datos, y luego
        // solicitamos explícitamente la lista completa vía getOrdersWithPendingChangeRequests sin filtros)
        try {
          this.orderService.getOrders(); // intenta rellenar cache en el servicio (si existe)
        } catch (e) { /* noop */ }
        // como fallback seguro, solicitar nuevamente (o podrías crear getAllOrders en el service)
        this.orderService.getOrdersWithPendingChangeRequests().subscribe({
          next: (orders) => this.allOrders.set(orders as OrderHistory[]),
          error: (e) => console.error('Fallback also failed:', e)
        });
      }
    });

    // vehiculos
    this.vehicleService.getVehicles();
    this.vehicles$.subscribe(vehicles => {
      this.allVehicles.set(vehicles);
    });
  }

  filteredOrders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.selectedUserType();
    const monthDate = this.currentMonth(); // primer día del mes
    const targetYear = monthDate.getFullYear();
    const targetMonth = monthDate.getMonth(); 

    return this.allOrders()
       .filter(u => {
         const matchesName = term ? u.user?.username?.toLowerCase().includes(term) : true;
         const matchesType = type ? u.product?.name === type : true;
         if (!matchesName || !matchesType) return false;

        // filtrar por mes: comparar año y mes
        if (!u.createdAt) return false;
        const created = new Date(u.createdAt);
        return created.getFullYear() === targetYear && created.getMonth() === targetMonth;
       });
  });

  // ---- navegación de meses ----
  prevMonth() {
    if (this.canGoPrev()) {
      const cur = this.currentMonth();
      const prev = new Date(cur.getFullYear(), cur.getMonth() - 1, 1);
      this.currentMonth.set(prev);
    }
  }

  nextMonth() {
    if (this.canGoNext()) {
      const cur = this.currentMonth();
      const next = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      this.currentMonth.set(next);
    }
  }

  goToCurrentMonth() {
    const now = new Date();
    this.currentMonth.set(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  getVehicleNameById(vehicleId?: number): string {
    if (!vehicleId) return 'Desconocido';
    const vehicle = this.allVehicles().find(v => v.type_vehicle_id === vehicleId);
    return vehicle ? vehicle.name : 'Desconocido';
  }

  goToDetails(orderId?: number) {
    this.router.navigate([`/admin/ver-pedidos-por-editar-eliminar/${orderId}`]);
  }

  descargarTabla() {
    // Tomamos la tabla directamente del DOM
        const element = document.querySelector('.main-table table') as HTMLElement;
        if (!element) return;
    
        // Convertir la tabla HTML a una hoja Excel
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    
        // Crear un libro de Excel y agregar la hoja
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');
    
        // Exportar el archivo Excel
        const nombreArchivo = `solicitud-pedidos-para-editar-o-eliminar-${new Date().toISOString().slice(0,10)}.xlsx`;
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
        // Guardar archivo
        const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, nombreArchivo);
  }

}
