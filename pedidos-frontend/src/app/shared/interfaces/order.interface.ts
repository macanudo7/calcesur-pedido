export interface OrderForm {
    order_id?: number;
    user_id: number; // ID del usuario que realiza el pedido
    product_id: number; // ID del producto seleccionado
    status: string; // Estado del pedido (por ejemplo, "pending")
    orderDates: OrderDate[]; // Lista de fechas de entrega
  }
  
  export interface OrderDate {
    order_date_id?: number; // ID de la fecha de entrega (opcional, para actualizaciones)
    order_id?: number; // ID del pedido al que pertenece esta fecha
    delivery_date: string; // Fecha de entrega en formato "YYYY-MM-DD"
    quantity: number; // Cantidad solicitada
    status?: string; // Estado de la entrega (por ejemplo, "pending")
    rating?: number; // Calificación del producto (opcional)
    is_delivered?: string; // Indica si el producto ha sido entregado (opcional)
    assigment_date?: Date;
  }