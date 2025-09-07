import { TestBed } from '@angular/core/testing';

import { OrderDate } from './order-date';

describe('OrderDate', () => {
  let service: OrderDate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
