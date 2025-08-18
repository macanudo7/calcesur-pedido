import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AProgramacionMes } from './a-programacion-mes';

describe('AProgramacionMes', () => {
  let component: AProgramacionMes;
  let fixture: ComponentFixture<AProgramacionMes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AProgramacionMes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AProgramacionMes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
