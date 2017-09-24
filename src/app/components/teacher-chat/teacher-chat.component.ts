import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'teacher-chat',
  templateUrl: './teacher-chat.component.html',
  styleUrls: [ './teacher-chat.component.scss' ]
})
export class TeacherChatComponent implements OnInit, OnDestroy {

  private connection;
  private emitterType = 'teacher';
  private messages = { };
  private students = [];
  private selectedStudent;
  @Input() private name: string;
  @Input() private roomId: string;

  constructor(private websocket: WebsocketService) {
    this.websocket.connect();
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('message').subscribe((message: any) => {
      message.emitterType = 'student';
      this.messages[message.emitter].push(message);
    });

    this.connection = this.websocket.addListener('new-students').subscribe((data: any) => {
      this.students = this.students.concat(data.students);
      data.students.forEach((student) => {
        this.messages[student.id] = [];
      });
    });

    this.connection = this.websocket.addListener('del-student').subscribe((data: any) => {
      this.students = this.students.filter(student => student.id != data.student);
      delete this.messages[data.student];
    });

    this.websocket.send(
      'init',
      {
        emitterType: this.emitterType,
        name: this.name,
        roomId: this.roomId
      }
    );
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
    this.websocket.disconnect();
  }
}
