export interface CreateChangeRequestPayload {
  order_date_id: number;
  request_type: 'change_quantity' | 'cancel' | 'create_order_date'| string;
  change_quantity?: number;
  admin_notes?: string;
  original_quantity?: number; // NUEVO
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
  request_type: 'change_quantity' | 'cancel' | 'create_order_date' | string;
  change_quantity?: number | null;
  original_quantity?: number; // NUEVO
  requested_at?: string | null;   // fecha en ISO (puede venir del backend)
  admin_response_at?: string | null;
  status: 'pending' | 'approved' | 'accepted' | 'rejected' | 'canceled' | string;
  admin_notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Nuevos tipos para la query batch
export interface ChangeRequestsQueryPayload {
  order_date_ids: number[];
  limit_per_order_date?: number;
}

export interface ChangeRequestsQueryResponse {
  // El backend devuelve claves como strings (ej. "6","88"), por eso usamos Record<string, ...>
  byOrderDate: Record<string, ChangeRequest[]>;
}