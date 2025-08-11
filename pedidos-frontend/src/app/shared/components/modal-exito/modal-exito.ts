import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-exito',
  imports: [ CommonModule ],
  templateUrl: './modal-exito.html',
  styleUrl: './modal-exito.scss',
  standalone: true,
})
export class ModalExito {
  @Input() mostrarExito: boolean = false;
  @Input() mensajeExito: string = 'Se creó con éxito';
  @Input() destino: string = 'creado';
  @Output() exitoso = new EventEmitter<void>();


  onExitoso() {
    this.mostrarExito = false;
    console.log('asasdasdads')
    this.exitoso.emit();

  }

}
