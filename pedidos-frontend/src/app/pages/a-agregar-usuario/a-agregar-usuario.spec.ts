import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AAgregarUsuario } from './a-agregar-usuario';

describe('AAgregarUsuario', () => {
  let component: AAgregarUsuario;
  let fixture: ComponentFixture<AAgregarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AAgregarUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AAgregarUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
