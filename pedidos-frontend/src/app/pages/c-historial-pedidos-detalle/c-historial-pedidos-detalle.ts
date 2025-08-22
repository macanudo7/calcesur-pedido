import { Component, OnInit,inject } from '@angular/core';
import { Order } from '../../services/order';
import { OrderDetail, OrderForm } from '../../shared/interfaces/order.interface';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-c-historial-pedidos-detalle',
  templateUrl: './c-historial-pedidos-detalle.html',
  styleUrl: './c-historial-pedidos-detalle.scss',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule,RouterModule],
  providers: [DatePipe], 
})
export class CHistorialPedidosDetalle implements OnInit {
  private router = inject(Router); 
  orderId: number = 0;
  orderDetail: OrderDetail | null = null;
  fechasDelMes: Date[] = []; // Todas las fechas del mes
  orderDatesMap: { [key: string]: any } = {}; // Mapa de fechas a orderDates
  mesYAnio: string | null = null; // Variable auxiliar para el mes y año
  modoEdicion: boolean = false; // Variable para controlar el modo de edición
  estadoInicial: OrderDetail | null = null; // Copia del estado inicial
  confirmSaveVisible: boolean = false; // <-- nueva prop

  constructor(
    private route: ActivatedRoute, 
    private orderService: Order, 
  ) {}

  ngOnInit() {
    // Obtener el ID del pedido desde la URL
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    // Consultar los detalles del pedido
    this.orderService.getOrderDetail(this.orderId).subscribe({
      next: (data) => {
          this.orderDetail = data;
          this.estadoInicial = JSON.parse(JSON.stringify(data)); // Guardar copia del estado inicial
          if (this.orderDetail?.orderDates?.length) {
          const deliveryDate = new Date(this.orderDetail.orderDates[0].delivery_date);
          const mes = deliveryDate.toLocaleDateString('es-ES', { month: 'long' }); // Solo el mes
          const anio = deliveryDate.getFullYear(); // Solo el año
          this.mesYAnio = `${mes} ${anio}`; // Concatenar mes y año
        }
        this.generarFechasDelMes();
        this.mapearOrderDates();
      },
      error: (err) => {
        console.error('Error al obtener los detalles del pedido:', err);
      },
    });
  }

  toggleEditar() {
    if (this.modoEdicion) {
      // Recargar la página al cancelar
      window.location.reload();
    } else {
      // Activar el modo edición
      this.modoEdicion = true;
    }
  }
  esFechaEditable(fecha: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ignorar la hora
    return fecha > hoy; // Solo habilitar fechas posteriores a hoy
  }

  guardarCambios() {
  if (!this.orderDetail) return;

  const nuevosOrderDates = this.fechasDelMes
    .map((fecha) => {
      const orderDate = this.orderDatesMap[fecha.toDateString()] || {};
      return {
        order_date_id: orderDate.order_date_id || null,
        delivery_date: fecha.toISOString(),
        quantity: orderDate.quantity || 0,
        status: orderDate.status || 'pending',
      };
    })
    .filter((orderDate) => orderDate.quantity > 0);

  const payload: OrderForm = {
    order_id: this.orderDetail.order_id,
    user_id: this.orderDetail.user_id,
    product_id: this.orderDetail.product_id,
    status: this.orderDetail.status,
    orderDates: nuevosOrderDates,
  };

  console.log('Datos a enviar:', payload);

  this.orderService.editarPedido(this.orderId, payload).subscribe({
    next: () => {
      console.log('Pedido actualizado correctamente');
      this.modoEdicion = false;

      // Confirmar que el router no es undefined
      console.log('Router:', this.router);

      // Redirigir al historial de pedidos
      this.router.navigate(['/cliente/historial-pedidos']);
    },
    error: (err) => {
      console.error('Error al actualizar el pedido:', err);
    },
  });
}


  // Generar todas las fechas del mes correspondiente
  generarFechasDelMes() {
    if (!this.orderDetail || !this.orderDetail.orderDates.length) return;

    const primerOrderDate = new Date(this.orderDetail.orderDates[0].delivery_date);
    const anio = primerOrderDate.getFullYear();
    const mes = primerOrderDate.getMonth();

    const diasEnElMes = new Date(anio, mes + 1, 0).getDate(); // Último día del mes
    this.fechasDelMes = Array.from({ length: diasEnElMes }, (_, i) => new Date(anio, mes, i + 1));
  }

  // Mapear los orderDates a las fechas del mes
  mapearOrderDates() {
    if (!this.orderDetail) return;

    this.fechasDelMes.forEach((fecha) => {
      const fechaKey = fecha.toDateString();
      if (!this.orderDatesMap[fechaKey]) {
        // No inicializar `status` para nuevas fechas
        this.orderDatesMap[fechaKey] = {};
      }
    });

    this.orderDetail.orderDates.forEach((orderDate) => {
      const fecha = new Date(orderDate.delivery_date).toDateString();
      this.orderDatesMap[fecha] = orderDate;
    });
  }


  descargarTabla(){

  }
  
  openConfirmSave() {
    this.confirmSaveVisible = true;
  }

  cancelConfirmSave() {
    this.confirmSaveVisible = false;
  }

  confirmSave() {
    this.confirmSaveVisible = false;
    // llama al método que realiza el guardado (y la navegación)
    this.guardarCambios();
  }
}
