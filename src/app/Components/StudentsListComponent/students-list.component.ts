import { Component, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../Services/websocket.service';

@Component({
  selector: 'students-list',
  templateUrl: './students-list.component.html',
  styleUrls: [ './students-list.component.scss' ]
})
export class StudentsListComponent {

  private students = [];
  private selectedStudent = '1';
  private connection;

  constructor(private websocket: WebsocketService) { }

  selectStudent(id): void {
    this.selectedStudent = id;
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('new-students').subscribe((data: any) => {
      this.students = this.students.concat(data.students);
    });

    this.connection = this.websocket.addListener('del-student').subscribe((data: any) => {
      this.students = this.students.filter(student => student != data.student);
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
