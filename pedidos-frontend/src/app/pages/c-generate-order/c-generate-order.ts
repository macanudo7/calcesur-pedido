import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-c-generate-order',
  imports: [CommonModule],
  templateUrl: './c-generate-order.html',
  styleUrl: './c-generate-order.scss'
})
export class CGenerateOrder {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  solicitarPedido() {
    console.log(':3')
  }

  diasDelMes: { dia: number, nombre: string }[] = [];

  ngOnInit() {
    const mes = 6;
    const anio = 2025;
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();

    for (let i = 1; i <= diasEnMes; i++) {
      const fecha = new Date(anio, mes, i);
      const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long' });
      this.diasDelMes.push({
        dia: i,
        nombre: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      });
    }
  }

}
