import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AEditarPedidosPorConfirmar } from './a-editar-pedidos-por-confirmar';

describe('AEditarPedidosPorConfirmar', () => {
  let component: AEditarPedidosPorConfirmar;
  let fixture: ComponentFixture<AEditarPedidosPorConfirmar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AEditarPedidosPorConfirmar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AEditarPedidosPorConfirmar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
