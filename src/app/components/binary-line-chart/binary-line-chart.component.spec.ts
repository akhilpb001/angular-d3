import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryLineChartComponent } from './binary-line-chart.component';

describe('BinaryLineChartComponent', () => {
  let component: BinaryLineChartComponent;
  let fixture: ComponentFixture<BinaryLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinaryLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinaryLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
