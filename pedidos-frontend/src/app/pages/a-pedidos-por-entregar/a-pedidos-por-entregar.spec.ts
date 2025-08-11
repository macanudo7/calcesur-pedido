import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APedidosPorEntregar } from './a-pedidos-por-entregar';

describe('APedidosPorEntregar', () => {
  let component: APedidosPorEntregar;
  let fixture: ComponentFixture<APedidosPorEntregar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APedidosPorEntregar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(APedidosPorEntregar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
