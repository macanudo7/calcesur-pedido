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
  selector: 'app-a-pedidos-confirmado-entregado',
  imports: [CommonModule, FormsModule],
  templateUrl: './a-pedidos-confirmado-entregado.html',
  styleUrl: './a-pedidos-confirmado-entregado.scss',
  standalone: true,
})
export class APedidosConfirmadoEntregado implements OnInit{

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

  filteredOrders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.selectedUserType();

    return this.allOrders()
    .filter(order => order.status === 'confirmed')
    .filter(order =>
      order.orderDates?.some(od => od.is_delivered === 'entregado')
    )
    .filter(u => {
      const matchesName = term ? u.user?.name.toLowerCase().includes(term) : true;
      const matchesType = type ? u.product?.name === type : true;
      return matchesName && matchesType;
    });
  });

  getVehicleNameById(vehicleId?: number): string {
    if (!vehicleId) return 'Desconocido';
    const vehicle = this.allVehicles().find(v => v.type_vehicle_id === vehicleId);
    return vehicle ? vehicle.name : 'Desconocido';
  }

  goToDetails(orderId?: number) {
    this.router.navigate([`/admin/ver-pedidos-entregados/${orderId}`]);
  }

  descargarTabla() {
    console.log(':)')
  }

}
