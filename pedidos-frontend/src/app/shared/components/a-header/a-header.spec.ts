import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AHeader } from './a-header';

describe('AHeader', () => {
  let component: AHeader;
  let fixture: ComponentFixture<AHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
