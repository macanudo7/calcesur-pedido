import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmacion',
  imports: [ CommonModule ],
  templateUrl: './modal-confirmacion.html',
  styleUrl: './modal-confirmacion.scss',
  standalone: true,
})
export class ModalConfirmacion {
  @Input() mostrar: boolean = false;
  @Input() mensaje: string = '¿Estás seguro de continuar?';
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar() {
    this.confirmar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
