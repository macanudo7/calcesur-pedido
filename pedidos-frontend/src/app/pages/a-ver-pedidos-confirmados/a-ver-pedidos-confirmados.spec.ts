import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AVerPedidosConfirmados } from './a-ver-pedidos-confirmados';

describe('AVerPedidosConfirmados', () => {
  let component: AVerPedidosConfirmados;
  let fixture: ComponentFixture<AVerPedidosConfirmados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AVerPedidosConfirmados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AVerPedidosConfirmados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
