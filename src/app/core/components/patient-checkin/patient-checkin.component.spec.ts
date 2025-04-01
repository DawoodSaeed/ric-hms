import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCheckinComponent } from './patient-checkin.component';

describe('PatientCheckinComponent', () => {
  let component: PatientCheckinComponent;
  let fixture: ComponentFixture<PatientCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCheckinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
