import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCompanyInputComponent } from './select-company-input.component';

describe('SelectCompanyInputComponent', () => {
  let component: SelectCompanyInputComponent;
  let fixture: ComponentFixture<SelectCompanyInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCompanyInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCompanyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
