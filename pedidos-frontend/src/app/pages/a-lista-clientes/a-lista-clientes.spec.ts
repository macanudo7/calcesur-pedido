import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AListaClientes } from './a-lista-clientes';

describe('AListaClientes', () => {
  let component: AListaClientes;
  let fixture: ComponentFixture<AListaClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AListaClientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AListaClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
