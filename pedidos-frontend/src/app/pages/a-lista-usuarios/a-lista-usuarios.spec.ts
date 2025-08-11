import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AListaUsuarios } from './a-lista-usuarios';

describe('AListaUsuarios', () => {
  let component: AListaUsuarios;
  let fixture: ComponentFixture<AListaUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AListaUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AListaUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
