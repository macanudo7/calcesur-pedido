import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderForm, OrderDate, OrderDetail, OrderDateDetail } from '../../shared/interfaces/order.interface';
import { Order } from '../../services/order';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-a-ver-pedidos-confirmados',
  imports: [CommonModule],
  templateUrl: './a-ver-pedidos-confirmados.html',
  styleUrl: './a-ver-pedidos-confirmados.scss',
  standalone: true,
})
export class AVerPedidosConfirmados implements OnInit {
  nameOfUser: string | null = null;
  userId?: number;
  productName: string = '';
  ordersPerDay: OrderDateDetail[] = [];
  nameOfVehicle: string = '';
  nameOfClient: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: Order,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.nameOfUser = sessionStorage.getItem('userName');
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;

        this.orderService.getOrderDetail(this.userId).subscribe(user => {
          this.productName = user.product?.name || 'Desconocido';
          this.nameOfVehicle = user.product?.typeVehicle?.name || 'Desconocido';
          this.nameOfClient = user.user?.username || 'Desconocido';

          this.ordersPerDay = user.orderDates || [];
          this.ordersPerDay.sort((a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime());
          console.log('Orders per day:', this.ordersPerDay);
        });
      }
    });

  }

  gotoListOrders() {
    this.router.navigate(['/admin/pedidos-por-entregar']);
  }
}
