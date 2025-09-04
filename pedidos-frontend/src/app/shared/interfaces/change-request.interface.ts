export interface CreateChangeRequestPayload {
  order_date_id: number;
  request_type: 'change_quantity' | 'cancel' | string;
  change_quantity?: number;
  admin_notes?: string;
}

export interface UpdateChangeRequestPayload {
  status: 'pending' | 'approved' | 'rejected' | string;
  admin_notes?: string;
  admin_response_at?: string; // ISO datetime
  apply_to_order_date?: boolean;
}

export interface ChangeRequest {
  request_id: number;             // clave primaria según el modelo
  order_date_id: number;
  request_type: string;
  change_quantity?: number | null;
  requested_at?: string | null;   // fecha en ISO (puede venir del backend)
  admin_response_at?: string | null;
  status: string;
  admin_notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}