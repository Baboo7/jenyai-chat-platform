import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSpaceComponent } from './teacher-space.component';

describe('TeacherSpaceComponent', () => {
  let component: TeacherSpaceComponent;
  let fixture: ComponentFixture<TeacherSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
