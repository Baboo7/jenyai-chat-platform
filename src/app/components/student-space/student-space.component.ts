import { Component } from '@angular/core';

@Component({
  selector: 'student-space',
  templateUrl: './student-space.component.html',
  styleUrls: [ './student-space.component.scss' ]
})
export class StudentSpaceComponent {

  private connected: boolean = false;
  private name: string;
  private roomId: string;

  constructor() { }
}
