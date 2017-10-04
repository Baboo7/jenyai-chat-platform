import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { Parser } from '../../message-parser';

@Component({
  selector: 'student-chat',
  templateUrl: './student-chat.component.html',
  styleUrls: [ './student-chat.component.scss' ]
})
export class StudentChatComponent implements OnInit, OnDestroy {

  private connection;
  private emitterType = 'student';
  private messages = [ ];
  @Input() private name: string;
  @Input() private roomId: string;

  constructor(private websocket: WebsocketService) {
    this.websocket.connect();
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('message').subscribe((data: any) => {
      let msg = Parser.format(data, this.emitterType);
      if (msg !== null) { this.messages.push(msg); }
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
