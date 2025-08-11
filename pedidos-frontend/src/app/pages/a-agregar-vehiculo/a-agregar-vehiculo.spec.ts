import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AAgregarVehiculo } from './a-agregar-vehiculo';

describe('AAgregarVehiculo', () => {
  let component: AAgregarVehiculo;
  let fixture: ComponentFixture<AAgregarVehiculo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AAgregarVehiculo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AAgregarVehiculo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
