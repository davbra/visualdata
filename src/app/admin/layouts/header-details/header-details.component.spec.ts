import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDetailsComponent } from './header-details.component';

describe('HeaderDetailsComponent', () => {
  let component: HeaderDetailsComponent;
  let fixture: ComponentFixture<HeaderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
