import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLogin } from './c-login';

describe('CLogin', () => {
  let component: CLogin;
  let fixture: ComponentFixture<CLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
