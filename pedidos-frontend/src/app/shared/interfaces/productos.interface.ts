export interface PutProductoForm {
  product_id?: number | undefined;
  name: String;
  type_vehicle_id: Number;
  code: Number;
  type_unit: String;
  spec_sheet_url?: String;
}

export interface ProductoForm {
  id?: number | undefined;
  code: Number;
  name: String;
  type_unit: String;
  type_vehicle: {
      type_vehicle_id: Number;
      name?: String;
    };
  spec_sheet_url?: String;
}