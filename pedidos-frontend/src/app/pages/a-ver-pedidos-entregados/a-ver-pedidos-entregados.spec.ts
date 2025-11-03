import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AVerPedidosEntregados } from './a-ver-pedidos-entregados';

describe('AVerPedidosEntregados', () => {
  let component: AVerPedidosEntregados;
  let fixture: ComponentFixture<AVerPedidosEntregados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AVerPedidosEntregados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AVerPedidosEntregados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
