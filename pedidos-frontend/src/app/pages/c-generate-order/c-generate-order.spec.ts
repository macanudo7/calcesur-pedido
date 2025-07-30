import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CGenerateOrder } from './c-generate-order';

describe('CGenerateOrder', () => {
  let component: CGenerateOrder;
  let fixture: ComponentFixture<CGenerateOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CGenerateOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CGenerateOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
