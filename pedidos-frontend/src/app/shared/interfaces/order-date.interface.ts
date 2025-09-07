export interface OrderDateCreatePayload {
  order_id: number;
  delivery_date: string; // "YYYY-MM-DD"
  quantity: number;
  status?: string;
}

export interface OrderDateUpdatePayload {
  quantity?: number;
  status?: string;
  rating?: number | null;
  is_delivered?: string | null;
  assigment_date?: string | null; // ISO date or "YYYY-MM-DD"
}

export interface OrderDate {
  order_date_id: number;
  order_id: number;
  delivery_date: string; // DATEONLY -> "YYYY-MM-DD"
  quantity: number;
  rating?: number | null;
  is_delivered?: string | null;
  status: string;
  assigment_date?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
