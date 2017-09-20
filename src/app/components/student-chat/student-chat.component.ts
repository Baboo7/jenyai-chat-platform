import { Component, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'student-chat',
  templateUrl: './student-chat.component.html',
  styleUrls: [ './student-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class StudentChatComponent implements OnInit, OnDestroy {

  private connection;
  private emitterType = 'student';
  private messages = [ ];

  constructor(private websocket: WebsocketService) {
    this.websocket.send('init', {emitterType: this.emitterType});
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('message').subscribe((message: any) => {
      message.emitterType = 'teacher';
      this.messages.push(message);
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
