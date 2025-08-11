import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADetallePorCliente } from './a-detalle-por-cliente';

describe('ADetallePorCliente', () => {
  let component: ADetallePorCliente;
  let fixture: ComponentFixture<ADetallePorCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADetallePorCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADetallePorCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
