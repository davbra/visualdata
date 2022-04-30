import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnalyticsPopupComponent } from './add-analytics-popup.component';

describe('AddAnalyticsPopupComponent', () => {
  let component: AddAnalyticsPopupComponent;
  let fixture: ComponentFixture<AddAnalyticsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnalyticsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnalyticsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
