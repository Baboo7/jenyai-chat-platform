import { Component, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../Services/websocket.service';

@Component({
  selector: 'teacher-chat',
  templateUrl: './teacher-chat.component.html',
  styleUrls: [ './teacher-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class TeacherChatComponent implements OnInit, OnDestroy {

  private connection;
  private emitterType = 'teacher';
  private messages = { };
  private students = [];
  private selectedStudent;

  constructor(private websocket: WebsocketService) {
    this.websocket.send('init', {emitterType: this.emitterType});
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('message').subscribe((message: any) => {
      message.emitterType = 'student';
      this.messages[message.emitter].push(message);
    });

    this.connection = this.websocket.addListener('new-students').subscribe((data: any) => {
      this.students = this.students.concat(data.students);
      data.students.forEach((student: number) => {
        this.messages[student] = [];
      });
    });

    this.connection = this.websocket.addListener('del-student').subscribe((data: any) => {
      this.students = this.students.filter(student => student != data.student);
      delete this.messages[data.student];
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
