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

export interface OrderHistory {
order_id: number; // ID del pedido
user_id: number; // ID del usuario
product: {
    name: string;
    code: number;
    typeVehicle: { // Agrega esta propiedad
      name: string;
    };
  };
status: string; // Estado del pedido
cumplimiento: string; // Porcentaje de cumplimiento
avanceCronograma: string; // Porcentaje de avance del cronograma
createdAt: string; // Fecha de creación
updatedAt: string; // Fecha de última actualización
orderDates: OrderDateHistory[]; // Fechas asociadas al pedido
}

export interface OrderDateHistory {
  order_date_id: number; // ID de la fecha del pedido
  order_id: number; // ID del pedido asociado
  delivery_date: string; // Fecha de entrega
  quantity: number; // Cantidad solicitada
  rating: number | null; // Calificación (si aplica)
  is_delivered: boolean | null; // Si fue entregado
  status: string; // Estado de la fecha del pedido
  assigment_date: string | null; // Fecha de asignación
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de última actualización
}

export interface OrderDetail {
  order_id: number;
  user_id: number;
  product_id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    user_id: number; // Incluye el ID del usuario
    username?: string;
  };
  product?: {
    product_id: number; // Incluye el ID del producto
    name?: string;
    typeVehicle?: {
      type_vehicle_id: number; // Incluye el ID del tipo de vehículo
      name?: string;
    };
  };
  orderDates: OrderDateDetail[];
}

export interface OrderDateDetail {
  order_date_id: number;
  order_id: number;
  delivery_date: string;
  quantity: number;
  rating: number | null;
  is_delivered: boolean | null;
  status: string;
  assigment_date: string | null;
  createdAt: string;
  updatedAt: string;
}