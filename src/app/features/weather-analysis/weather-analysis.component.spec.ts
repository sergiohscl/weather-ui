import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherAnalysisComponent } from './weather-analysis.component';

describe('WeatherAnalysisComponent', () => {
  let component: WeatherAnalysisComponent;
  let fixture: ComponentFixture<WeatherAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeatherAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
