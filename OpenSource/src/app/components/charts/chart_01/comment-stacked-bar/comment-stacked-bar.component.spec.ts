import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentStackedBarComponent } from './comment-stacked-bar.component';

describe('CommentStackedBarComponent', () => {
  let component: CommentStackedBarComponent;
  let fixture: ComponentFixture<CommentStackedBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentStackedBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentStackedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
