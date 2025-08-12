export interface UserForm {
  username: String;
  ruc?: String;
  password: String;
  email: String;
  name: String;
  phone?: String;
  userType: String;
  status: String;
  observations?: String;
  usualProductsNotes?: String;
  ccEmails?: String;
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