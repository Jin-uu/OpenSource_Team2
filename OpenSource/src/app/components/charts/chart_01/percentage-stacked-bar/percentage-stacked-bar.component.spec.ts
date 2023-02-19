import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageStackedBarComponent } from './percentage-stacked-bar.component';

describe('PercentageStackedBarComponent', () => {
  let component: PercentageStackedBarComponent;
  let fixture: ComponentFixture<PercentageStackedBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageStackedBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageStackedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
