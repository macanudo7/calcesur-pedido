import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APedidosPorConfirmar } from './a-pedidos-por-confirmar';

describe('APedidosPorConfirmar', () => {
  let component: APedidosPorConfirmar;
  let fixture: ComponentFixture<APedidosPorConfirmar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APedidosPorConfirmar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(APedidosPorConfirmar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
