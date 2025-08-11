import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CHistorialPedidos } from './c-historial-pedidos';

describe('CHistorialPedidos', () => {
  let component: CHistorialPedidos;
  let fixture: ComponentFixture<CHistorialPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CHistorialPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CHistorialPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
