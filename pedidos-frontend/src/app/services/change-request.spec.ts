import { TestBed } from '@angular/core/testing';

import { ChangeRequest } from './change-request';

describe('ChangeRequest', () => {
  let service: ChangeRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
