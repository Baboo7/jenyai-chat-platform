import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent {

  @Input() private connected: boolean;
  @Output() private connectedChange: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  joinSession(): void {
    this.connectedChange.emit(true);
  }
}
