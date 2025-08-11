import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AAgregarProducto } from './a-agregar-producto';

describe('AAgregarProducto', () => {
  let component: AAgregarProducto;
  let fixture: ComponentFixture<AAgregarProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AAgregarProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AAgregarProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
