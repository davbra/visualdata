import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnalyticsDetailsDescriptionPopupComponent } from './add-analytics-details-description-popup.component';

describe('AddAnalyticsDetailsDescriptionPopupComponent', () => {
  let component: AddAnalyticsDetailsDescriptionPopupComponent;
  let fixture: ComponentFixture<AddAnalyticsDetailsDescriptionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnalyticsDetailsDescriptionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnalyticsDetailsDescriptionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
