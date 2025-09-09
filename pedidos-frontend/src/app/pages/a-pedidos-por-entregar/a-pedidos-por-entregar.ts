import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderForm } from '../../shared/interfaces/order.interface';
import { Order } from '../../services/order';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../services/vehicle';
import { VehicleForm } from '../../shared/interfaces/vehicle.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-a-pedidos-por-entregar',
  imports: [CommonModule, FormsModule],
  templateUrl: './a-pedidos-por-entregar.html',
  styleUrl: './a-pedidos-por-entregar.scss',
  standalone: true,
})
export class APedidosPorEntregar implements OnInit{

  nameOfUser: string | null = null;

  orders$: Observable<OrderForm[]>;
  vehicles$: Observable<VehicleForm[]>;

  searchTerm = signal('');
  selectedUserType = signal('');
  allOrders = signal<OrderForm[]>([]);
  allVehicles = signal<VehicleForm[]>([]);

  userTypes: string[] = [];

  cumplimiento: number;
  cronograma: number;

  baseMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // currentMonth ya lo tienes:
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
    this.allOrders().filter(order => order.status === 'confirmed')
  );

  constructor(
    private router: Router,
    private orderService: Order,
    private cd: ChangeDetectorRef,
    private vehicleService: Vehicle
  ) {
    this.orders$ = this.orderService.orders$;
    this.vehicles$ = this.vehicleService.vehicles$;

    this.cumplimiento = 0;
    this.cronograma = 0;
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.nameOfUser = sessionStorage.getItem('userName');
    }

    this.orderService.getOrders();

    this.orders$.subscribe(orders => {
      this.allOrders.set(orders);
      console.log('Orders loaded:', orders);
      this.userTypes = Array.from(
        new Set(
          orders
            .map(o => o.product?.name)
            .filter((name): name is string => !!name)
        )
      );

      console.log('Products:', this.userTypes);
    });

    this.vehicleService.getVehicles();

    this.vehicles$.subscribe(vehicles => {
      this.allVehicles.set(vehicles);
      console.log('Vehicles loaded:', vehicles);
    });
  }

  // filteredOrders = computed(() => {
  //   const term = this.searchTerm().toLowerCase();
  //   const type = this.selectedUserType();

  //   return this.allOrders()
  //     .filter(order => order.status === 'confirmed')
  //     .filter(u => {
  //       const matchesName = term ? u.user?.name.toLowerCase().includes(term) : true;
  //       const matchesType = type ? u.product?.name === type : true;
  //       return matchesName && matchesType;
  //     });
  // });

  filteredOrders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.selectedUserType();
    const monthDate = this.currentMonth(); // primer día del mes
    const targetYear = monthDate.getFullYear();
    const targetMonth = monthDate.getMonth(); // 0..11

    return this.allOrders()
      .filter(order => order.status === 'confirmed')
      .filter(u => {
        const matchesName = term ? (u.user?.name ?? '').toLowerCase().includes(term) : true;
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
    this.router.navigate([`/admin/ver-pedidos-confirmados/${orderId}`]);
  }

  descargarTabla() {
    console.log(':)')
  }

}
