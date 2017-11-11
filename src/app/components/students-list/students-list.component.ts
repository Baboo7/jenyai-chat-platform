import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'students-list',
  templateUrl: './students-list.component.html',
  styleUrls: [ './students-list.component.scss' ]
})
export class StudentsListComponent implements OnInit, OnDestroy {

  @Input() private students;
  @Input() private selectedStudent: string;
  @Output() selectedStudentChange: EventEmitter<string> = new EventEmitter();

  constructor(private websocket: WebsocketService) {
    this.websocket.connect();
  }

  ngOnInit() {

    this.websocket.addListener('student-selected').subscribe((data: any) => {
      this.selectedStudentChange.emit(data.id);
    });
  }

  ngOnDestroy() {

    this.websocket.disconnect();
  }

  /*  Trigger the event to select a student.

      PARAMS
        id (string): id of the student to connect to

      RETURN
        none
  */
  onSelectStudent(id): void {

    let msg = {
      id: this.students[id].id
    };

    this.websocket.send('student-select', msg);
  }

  /*  Trigger the event to switch the student's interlocutor.

      PARAMS
        id (string): id of the student

      RETURN
        none
  */
  onToggleStudentInterlocutor(id): void {

    let msg = {
      id: this.students[id].id
    };

    this.websocket.send('student-switch', msg);
  }
}
