import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyPopupComponent } from './add-company-popup.component';

describe('AddCompanyPopupComponent', () => {
  let component: AddCompanyPopupComponent;
  let fixture: ComponentFixture<AddCompanyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
