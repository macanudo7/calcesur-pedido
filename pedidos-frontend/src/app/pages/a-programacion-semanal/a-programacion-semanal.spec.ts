import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AProgramacionSemanal } from './a-programacion-semanal';

describe('AProgramacionSemanal', () => {
  let component: AProgramacionSemanal;
  let fixture: ComponentFixture<AProgramacionSemanal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AProgramacionSemanal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AProgramacionSemanal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
