import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AVerDetalles } from './a-ver-detalles';

describe('AVerDetalles', () => {
  let component: AVerDetalles;
  let fixture: ComponentFixture<AVerDetalles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AVerDetalles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AVerDetalles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
