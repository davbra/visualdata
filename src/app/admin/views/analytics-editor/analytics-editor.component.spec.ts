import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsEditorComponent } from './analytics-editor.component';

describe('AnalyticsEditorComponent', () => {
  let component: AnalyticsEditorComponent;
  let fixture: ComponentFixture<AnalyticsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
