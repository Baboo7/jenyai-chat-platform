import { Component } from '@angular/core';

@Component({
  selector: 'teacher-space',
  templateUrl: './teacher-space.component.html',
  styleUrls: [ './teacher-space.component.scss' ]
})
export class TeacherSpaceComponent {

  private connected: boolean = false;
  private name: string;
  private roomId: string;

  constructor() { }
}
