export interface UserForm {
  user_id?: number;
  username: string;
  ruc?: string;
  password: string;
  email: string;
  name: string;
  phone?: string;
  userType: string;
  status: string;
  observations?: string;
  usualProductsNotes?: string;
  ccEmails?: string;
  leadTimeDays?: number;
}

// "username": "cliente-mina-xyz",
// #   "ruc": "10012345678",
// #   "password": "PasswordSeguro123",
// #   "email": "cliente.xyz@example.com",
// #   "name": "Mina XYZ S.A.C.",
// #   "phone": "987654321",
// #   "userType": "client",
// #   "status": "active",
// #   "observations": "Nuevo cliente potencial",
// #   "usualProductsNotes": "Necesita explosivos y aditivos",
// #   "ccEmails": "gerencia.mina@example.com",
// #   "leadTimeDays": 1

export interface loginDate {
  identifier: string, 
  password: string,
  userType: string,
}