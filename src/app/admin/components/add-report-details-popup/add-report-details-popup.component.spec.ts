import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportDetailsPopupComponent } from './add-report-details-popup.component';

describe('AddReportDetailsPopupComponent', () => {
  let component: AddReportDetailsPopupComponent;
  let fixture: ComponentFixture<AddReportDetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReportDetailsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReportDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
