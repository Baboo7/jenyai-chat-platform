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
    this.websocket.addListener('connect-student').subscribe((data: any) => {
      this.selectedStudentChange.emit(data.id);
    });
  }

  ngOnDestroy() {
    this.websocket.disconnect();
  }

  selectStudent(id): void {
    let msg = {
      id: this.students[id].id
    };

    this.websocket.send('connect-student', msg);
  }
}
