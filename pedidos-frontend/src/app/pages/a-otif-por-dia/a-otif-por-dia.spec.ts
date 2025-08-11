import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AOtifPorDia } from './a-otif-por-dia';

describe('AOtifPorDia', () => {
  let component: AOtifPorDia;
  let fixture: ComponentFixture<AOtifPorDia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AOtifPorDia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AOtifPorDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
