import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypetableComponent } from './typetable.component';

describe('TypetableComponent', () => {
  let component: TypetableComponent;
  let fixture: ComponentFixture<TypetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
