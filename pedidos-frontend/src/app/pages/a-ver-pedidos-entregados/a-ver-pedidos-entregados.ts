import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderForm, OrderDate, OrderDetail, OrderDateDetail } from '../../shared/interfaces/order.interface';
import { Order } from '../../services/order';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-a-ver-pedidos-entregados',
  imports: [CommonModule, ModalConfirmacion],
  templateUrl: './a-ver-pedidos-entregados.html',
  styleUrl: './a-ver-pedidos-entregados.scss',
  standalone: true,
})
export class AVerPedidosEntregados implements OnInit {
  nameOfUser: string | null = null;
  userId?: number;
  productName: string = '';
  ordersPerDay: OrderDateDetail[] = [];
  nameOfVehicle: string = '';
  nameOfClient: string = '';
  dateOfOrder: string = '';
  rating?: number;

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
          this.dateOfOrder = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
            : 'Desconocido';

          this.ordersPerDay = user.orderDates || [];
          this.ordersPerDay.sort((a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime());
          console.log('Orders per day:', this.ordersPerDay);
        });
      }
    });

  }

  getStars(rating: number | null | undefined): number[] {
    return rating ? Array(rating).fill(0) : [];
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
    const nombreArchivo = `pedidos-entregados-${new Date().toISOString().slice(0, 10)}.xlsx`;
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Guardar archivo
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, nombreArchivo);
  }

  gotoListOrders() {
    this.router.navigate(['/admin/pedidos-confirmados-entregados']);
  }

}
