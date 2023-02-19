import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotChartComponent } from './dot-chart.component';

describe('DotChartComponent', () => {
  let component: DotChartComponent;
  let fixture: ComponentFixture<DotChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
