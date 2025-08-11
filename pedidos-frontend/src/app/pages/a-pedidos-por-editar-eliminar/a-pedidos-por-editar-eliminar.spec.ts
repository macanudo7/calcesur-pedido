import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APedidosPorEditarEliminar } from './a-pedidos-por-editar-eliminar';

describe('APedidosPorEditarEliminar', () => {
  let component: APedidosPorEditarEliminar;
  let fixture: ComponentFixture<APedidosPorEditarEliminar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APedidosPorEditarEliminar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(APedidosPorEditarEliminar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
