import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'students-list',
  templateUrl: './students-list.component.html',
  styleUrls: [ './students-list.component.scss' ]
})
export class StudentsListComponent {

  @Input() private students: [number];
  @Input() private selectedStudent: number;
  @Output() selectedStudentChange: EventEmitter<number> = new EventEmitter();

  constructor(private websocket: WebsocketService) { }

  selectStudent(id): void {
    this.selectedStudentChange.emit(this.students[id]);
  }
}
