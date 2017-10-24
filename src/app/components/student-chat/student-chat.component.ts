import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import { TokenManager } from '../../services/token-manager.service';
import { Parser } from '../../message-parser';

@Component({
  selector: 'student-chat',
  templateUrl: './student-chat.component.html',
  styleUrls: [ './student-chat.component.scss' ],
  providers: [ WebsocketService, TokenManager ]
})
export class StudentChatComponent implements OnInit, OnDestroy {

  private connection;
  private id: string;
  private isEmitterTyping: boolean = false;
  private messages = [ ];

  @Output() private fireDisconnection: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private websocket: WebsocketService, private tokenManager: TokenManager) {
    this.websocket.connect();
  }

  ngOnInit() {
    this.connection = this.websocket.addListener('init').subscribe((data: any) => {
      this.id = data.id;
    });

    this.connection = this.websocket.addListener('disconnect').subscribe((data: any) => {
      this.disconnect();
    });

    this.connection = this.websocket.addListener('message').subscribe((data: any) => {
      let msg = Parser.format(data, this.id);
      if (msg !== null) { this.messages.push(msg); }
    });

    this.connection = this.websocket.addListener('typing-on').subscribe((data: any) => {
      this.isEmitterTyping = true;
    });

    this.connection = this.websocket.addListener('typing-off').subscribe((data: any) => {
      this.isEmitterTyping = false;
    });

    let msg = {
      token: this.tokenManager.retrieveToken()
    };

    this.websocket.send('init', msg);
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
    this.websocket.disconnect();
  }

  /*  Emit the event to disconnect the user from the room.

      PARAMS
        none

      RETURN
        none
  */
  private disconnect(): void {
    this.fireDisconnection.emit(true);
  }
}
