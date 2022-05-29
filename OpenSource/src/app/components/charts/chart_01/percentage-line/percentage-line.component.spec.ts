import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageLineComponent } from './percentage-line.component';

describe('PercentageLineComponent', () => {
  let component: PercentageLineComponent;
  let fixture: ComponentFixture<PercentageLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
