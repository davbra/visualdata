import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsDetailsFoldDivComponent } from './analytics-details-fold-div.component';

describe('AnalyticsDetailsFoldDivComponent', () => {
  let component: AnalyticsDetailsFoldDivComponent;
  let fixture: ComponentFixture<AnalyticsDetailsFoldDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsDetailsFoldDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsDetailsFoldDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
