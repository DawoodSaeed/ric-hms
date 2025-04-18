import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignStaffComponent } from './view-duties.component';

describe('AssignStaffComponent', () => {
  let component: AssignStaffComponent;
  let fixture: ComponentFixture<AssignStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
