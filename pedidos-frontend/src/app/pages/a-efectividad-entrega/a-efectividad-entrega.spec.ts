import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AEfectividadEntrega } from './a-efectividad-entrega';

describe('AEfectividadEntrega', () => {
  let component: AEfectividadEntrega;
  let fixture: ComponentFixture<AEfectividadEntrega>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AEfectividadEntrega]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AEfectividadEntrega);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
