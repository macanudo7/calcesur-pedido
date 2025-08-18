import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APedidosConfirmadoEntregado } from './a-pedidos-confirmado-entregado';

describe('APedidosConfirmadoEntregado', () => {
  let component: APedidosConfirmadoEntregado;
  let fixture: ComponentFixture<APedidosConfirmadoEntregado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APedidosConfirmadoEntregado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(APedidosConfirmadoEntregado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
