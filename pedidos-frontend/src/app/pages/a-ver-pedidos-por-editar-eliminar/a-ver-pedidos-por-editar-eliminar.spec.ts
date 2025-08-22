import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AVerPedidosPorEditarEliminar } from './a-ver-pedidos-por-editar-eliminar';

describe('AVerPedidosPorEditarEliminar', () => {
  let component: AVerPedidosPorEditarEliminar;
  let fixture: ComponentFixture<AVerPedidosPorEditarEliminar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AVerPedidosPorEditarEliminar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AVerPedidosPorEditarEliminar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
