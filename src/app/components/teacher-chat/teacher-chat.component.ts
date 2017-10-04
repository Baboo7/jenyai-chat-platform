import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { Parser } from '../../message-parser';

@Component({
  selector: 'teacher-chat',
  templateUrl: './teacher-chat.component.html',
  styleUrls: [ './teacher-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class TeacherChatComponent implements OnInit, OnDestroy {

  private connection;
  private emitterType: string = 'teacher';
  private id: string;
  private messages = { };
  private students = [ ];
  private selectedStudent;
  @Input() private name: string;
  @Input() private roomId: string;

  constructor(private websocket: WebsocketService) {
    this.websocket.connect();
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('init').subscribe((data: any) => {
      this.id = data.id;
    });

    this.connection = this.websocket.addListener('message').subscribe((data: any) => {
      let msg = Parser.format(data, this.id);
      if (msg !== null) {
        let emitterId = msg.emitterType === 'student' ? msg.emitter : msg.recipient;
        this.messages[emitterId].push(msg);
      }
    });

    this.connection = this.websocket.addListener('new-student').subscribe((data: any) => {
      this.students.push(data.student);
      this.messages[data.student.id] = [];
      data.messages.forEach(message => {
        let msg = Parser.format(message, this.id);
        if (msg !== null) {
          this.messages[data.student.id].push(msg);
        }
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
