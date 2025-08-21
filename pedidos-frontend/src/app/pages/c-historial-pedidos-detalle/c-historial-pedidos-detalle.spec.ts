import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CHistorialPedidosDetalle } from './c-historial-pedidos-detalle';

describe('CHistorialPedidosDetalle', () => {
  let component: CHistorialPedidosDetalle;
  let fixture: ComponentFixture<CHistorialPedidosDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CHistorialPedidosDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CHistorialPedidosDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
