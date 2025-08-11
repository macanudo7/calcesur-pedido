import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AListaVehiculos } from './a-lista-vehiculos';

describe('AListaVehiculos', () => {
  let component: AListaVehiculos;
  let fixture: ComponentFixture<AListaVehiculos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AListaVehiculos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AListaVehiculos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
