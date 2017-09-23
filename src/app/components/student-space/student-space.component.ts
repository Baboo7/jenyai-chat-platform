import { Component } from '@angular/core';

@Component({
  selector: 'app-student-space',
  templateUrl: './student-space.component.html',
  styleUrls: [ './student-space.component.scss' ]
})
export class StudentSpaceComponent {

  private connected: boolean = false;

  constructor() { }
}
