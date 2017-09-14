import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { WebsocketService } from '../../Services/websocket.service';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html',
  styleUrls: [ 'chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class ChatComponent implements OnInit, OnDestroy {

  private userInput = '';
  private messages = [];
  private connection;
  @Input() private emitterType;

  constructor(private websocket: WebsocketService) { }

  sendMessage(): void {
    this.websocket.send('message', {
      type: 'text',
      text: this.userInput
    });
    this.messages.push({payload: this.userInput});
    this.userInput = '';
  }

  ngOnInit() {
    this.connection = this.websocket.onEvent('message').subscribe(message => {
      this.messages.push(message);
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
